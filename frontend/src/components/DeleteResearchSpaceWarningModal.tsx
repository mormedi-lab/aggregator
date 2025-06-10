import { X } from "lucide-react";
import { DeleteResearchSpaceWarningModalProps } from "../types";

export default function DeleteResearchSpaceWarningModal({
  isOpen,
  onClose,
  onConfirm,
  spaceTitle
}: DeleteResearchSpaceWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2D2114] hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-semibold text-[#2D2114] mb-4">
          Are you sure you want to delete this research space?
        </h2>
        <p className="text-sm text-[#666565] mb-4">
          <strong className="text-[#FF5400]">{spaceTitle || "This research space"}</strong> has sources that have already been added to your project <br /><br /> Deleting it will remove those sources from the project <br></br>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-[8px] rounded-md border border-[#E0D8CF] text-sm text-[#2D2114] hover:bg-[#FAF9F5]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-[8px] rounded-md bg-[#FF5400] hover:bg-[#ff6a1a] text-white text-sm font-medium shadow-sm"
          >
            Delete anyway
          </button>
        </div>
      </div>
    </div>
  );
}
