
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionRoute?: string;
};

const EmptyState = ({
  title = "No items found",
  description = "There are no items listed on the marketplace yet.",
  actionLabel = "Sell an item",
  actionRoute = "/sell"
}: EmptyStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-purple-100 p-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
          <path d="M5 6h14M5 12h14M5 18h14" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mt-2">{title}</h2>
      <p className="text-gray-500 mt-2 max-w-md">{description}</p>
      <Button
        onClick={() => navigate(actionRoute)}
        className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default EmptyState;
