import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ProjectScope, Deliverable, TechnicalRequirement } from '../../../shared/types';

interface ScopeDefinitionProps {
  onSave: (scope: ProjectScope) => void;
  initialData?: Partial<ProjectScope>;
}

const validationSchema = Yup.object({
  requirements: Yup.array().of(
    Yup.string().required('Requirement is required')
  ).min(1, 'At least one requirement is needed'),
  deliverables: Yup.array().of(
    Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      dueDate: Yup.string().required('Due date is required'),
      status: Yup.string().oneOf(['pending', 'in_progress', 'completed']).required()
    })
  ),
  technicalRequirements: Yup.array().of(
    Yup.object({
      category: Yup.string().required('Category is required'),
      description: Yup.string().required('Description is required'),
      priority: Yup.string().oneOf(['low', 'medium', 'high']).required()
    })
  ),
  additionalNotes: Yup.string()
});

const generateId = () => Math.random().toString(36).substr(2, 9);

const ScopeDefinition: React.FC<ScopeDefinitionProps> = ({ onSave, initialData }) => {
  const formik = useFormik({
    initialValues: {
      requirements: initialData?.requirements || [''],
      deliverables: initialData?.deliverables || [],
      technicalRequirements: initialData?.technicalRequirements || [],
      additionalNotes: initialData?.additionalNotes || ''
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    }
  });

  return (
    <Paper sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h5" gutterBottom>Project Scope Definition</Typography>

          {/* Project Requirements */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Project Requirements</Typography>
            <FieldArray
              name="requirements"
              render={arrayHelpers => (
                <div>
                  {formik.values.requirements.map((requirement, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        name={`requirements.${index}`}
                        label={`Requirement ${index + 1}`}
                        value={requirement}
                        onChange={formik.handleChange}
                        error={Boolean(
                          formik.touched.requirements &&
                          Array.isArray(formik.errors.requirements) &&
                          formik.errors.requirements[index]
                        )}
                        helperText={
                          formik.touched.requirements &&
                          Array.isArray(formik.errors.requirements) &&
                          formik.errors.requirements[index]
                        }
                      />
                      <IconButton
                        onClick={() => arrayHelpers.remove(index)}
                        disabled={formik.values.requirements.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => arrayHelpers.push('')}
                  >
                    Add Requirement
                  </Button>
                </div>
              )}
            />
          </Box>

          {/* Deliverables */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Deliverables</Typography>
            <FieldArray
              name="deliverables"
              render={arrayHelpers => (
                <div>
                  {formik.values.deliverables.map((deliverable, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name={`deliverables.${index}.title`}
                            label="Deliverable Title"
                            value={deliverable.title}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name={`deliverables.${index}.description`}
                            label="Description"
                            value={deliverable.description}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            type="date"
                            name={`deliverables.${index}.dueDate`}
                            label="Due Date"
                            value={deliverable.dueDate}
                            onChange={formik.handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            name={`deliverables.${index}.status`}
                            label="Status"
                            value={deliverable.status}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                          </TextField>
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => arrayHelpers.remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => arrayHelpers.push({
                      id: generateId(),
                      title: '',
                      description: '',
                      dueDate: '',
                      status: 'pending'
                    })}
                  >
                    Add Deliverable
                  </Button>
                </div>
              )}
            />
          </Box>

          {/* Technical Requirements */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Technical Requirements</Typography>
            <FieldArray
              name="technicalRequirements"
              render={arrayHelpers => (
                <div>
                  {formik.values.technicalRequirements.map((requirement, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            name={`technicalRequirements.${index}.category`}
                            label="Category"
                            value={requirement.category}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            select
                            name={`technicalRequirements.${index}.priority`}
                            label="Priority"
                            value={requirement.priority}
                            onChange={formik.handleChange}
                          >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name={`technicalRequirements.${index}.description`}
                            label="Description"
                            value={requirement.description}
                            onChange={formik.handleChange}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => arrayHelpers.remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => arrayHelpers.push({
                      id: generateId(),
                      category: '',
                      description: '',
                      priority: 'medium'
                    })}
                  >
                    Add Technical Requirement
                  </Button>
                </div>
              )}
            />
          </Box>

          {/* Additional Notes */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Additional Notes</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="additionalNotes"
              value={formik.values.additionalNotes}
              onChange={formik.handleChange}
              placeholder="Add any additional notes or comments about the project scope..."
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!formik.isValid || !formik.dirty}
            >
              Save & Continue
            </Button>
          </Box>
        </Box>
      </FormikProvider>
    </Paper>
  );
};

export default ScopeDefinition;
