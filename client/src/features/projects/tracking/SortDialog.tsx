import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { LocalProject, CombinedProject } from '@shared/types';
import { getClientName } from '@shared/utils/projectHelpers';

type ProjectType = LocalProject | CombinedProject;

interface SortDialogProps {
  open: boolean;
  onClose: () => void;
  project: ProjectType;
  onUpdateProject: (data: Partial<ProjectType>) => void;
}

const SortDialog: React.FC<SortDialogProps> = ({
  open,
  onClose,
  project,
  onUpdateProject
}) => {
  const [category, setCategory] = useState(project.metadata?.category || '');
  const [notes, setNotes] = useState(project.metadata?.notes || '');

  const handleSubmit = () => {
    onUpdateProject({
      ...project,
      metadata: {
        ...project.metadata,
        category,
        notes,
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sort & Categorize Project</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Project Details
              </Typography>
              <Typography variant="body2">
                <strong>Client:</strong> {getClientName(project)}
              </Typography>
              <Typography variant="body2">
                <strong>Title:</strong> {project.title}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                  <MenuItem value="event">Event Coverage</MenuItem>
                  <MenuItem value="documentary">Documentary</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Project Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or categorization details..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save & Sort
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SortDialog;
