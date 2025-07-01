import { useState } from "react";

const ProductionBreakdownForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    overview: initialData.overview || "",
    timeline: initialData.timeline || [
      { phase: "", startDate: "", endDate: "", deliverables: "" },
    ],
    resources: initialData.resources || [
      { type: "", description: "", quantity: "" },
    ],
    requirements: initialData.requirements || "",
    notes: initialData.notes || "",
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    const updatedTimeline = [...formData.timeline];
    updatedTimeline[index] = {
      ...updatedTimeline[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      timeline: updatedTimeline,
    }));
  };

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = {
      ...updatedResources[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      resources: updatedResources,
    }));
  };

  const addTimelinePhase = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { phase: "", startDate: "", endDate: "", deliverables: "" },
      ],
    }));
  };

  const removeTimelinePhase = (index) => {
    if (formData.timeline.length <= 1) return;

    const updatedTimeline = [...formData.timeline];
    updatedTimeline.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      timeline: updatedTimeline,
    }));
  };

  const addResource = () => {
    setFormData((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        { type: "", description: "", quantity: "" },
      ],
    }));
  };

  const removeResource = (index) => {
    if (formData.resources.length <= 1) return;

    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      resources: updatedResources,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        type: "production-breakdown",
        timeline: formData.timeline.map((phase) => ({
          ...phase,
          quantity: phase.quantity ? parseInt(phase.quantity, 10) : 0,
        })),
        resources: formData.resources.map((resource) => ({
          ...resource,
          quantity: resource.quantity ? parseInt(resource.quantity, 10) : 0,
        })),
      });
    } catch (err) {
      console.error("Error submitting production breakdown:", err);
      setError("Failed to save production breakdown. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Production Breakdown</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Production Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="overview"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Production Overview
          </label>
          <textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Timeline Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Production Timeline</h3>
            <button
              type="button"
              onClick={addTimelinePhase}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Phase
            </button>
          </div>

          <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phase
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deliverables
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.timeline.map((phase, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={phase.phase}
                        onChange={(e) =>
                          handleTimelineChange(index, "phase", e.target.value)
                        }
                        placeholder="Phase name"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="date"
                        value={phase.startDate}
                        onChange={(e) =>
                          handleTimelineChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="date"
                        value={phase.endDate}
                        onChange={(e) =>
                          handleTimelineChange(index, "endDate", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={phase.deliverables}
                        onChange={(e) =>
                          handleTimelineChange(
                            index,
                            "deliverables",
                            e.target.value
                          )
                        }
                        placeholder="Key deliverables"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeTimelinePhase(index)}
                        disabled={formData.timeline.length <= 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Production Resources</h3>
            <button
              type="button"
              onClick={addResource}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Resource
            </button>
          </div>

          <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.resources.map((resource, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={resource.type}
                        onChange={(e) =>
                          handleResourceChange(index, "type", e.target.value)
                        }
                        placeholder="Resource type"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={resource.description}
                        onChange={(e) =>
                          handleResourceChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={resource.quantity}
                        onChange={(e) =>
                          handleResourceChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        min="0"
                        placeholder="0"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        disabled={formData.resources.length <= 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Technical Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Production Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionBreakdownForm;
