import { FiLayers } from "react-icons/fi";

const StaffPagesAssigned = ({pagesAssigned} : {pagesAssigned: string[]}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-50/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-50/50 flex items-center gap-3">
        <div className="p-2 bg-primary-10/10 rounded-lg">
          <FiLayers className="text-primary-10" size={18} />
        </div>
        <h2 className="font-semibold text-neutral-10">Pages Assigned</h2>
      </div>
      <div className="p-6">
        {pagesAssigned && pagesAssigned?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pagesAssigned.map((page: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary-10/10 text-primary-10 text-xs font-medium rounded-lg"
              >
                {page}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-30 text-center py-4">
            No pages assigned
          </p>
        )}
      </div>
    </div>
  );
};

export default StaffPagesAssigned;
