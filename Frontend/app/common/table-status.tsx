interface StatusLabelProps {
  status: string;
}

export default function StatusLabel({ status }: StatusLabelProps) {
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Muted":
        return "text-red-500";
      case "Rejected":
        return "text-red-900 font-bold"; 
      case "Waiting":
        return "text-green-500"; 
      case "Review":
        return "text-blue-500";
      case "Published":
        return "text-orange-500";
      default:
        return "text-black";
    }
  };

  return (
    <span className={`font-medium ${getStatusColorClass(status)}`}>
      {status}
    </span>
  );
}