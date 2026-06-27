import { getComplaintStatusBadgeClass, getComplaintStatusLabel } from "../../utils/complaintUtils.jsx";

function ComplaintStatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getComplaintStatusBadgeClass(status)}`}
    >
      {label || getComplaintStatusLabel(status)}
    </span>
  );
}

export default ComplaintStatusBadge;
