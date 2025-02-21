import React, { useState, useEffect } from "react";
import UploadBulkFacilities from "../forms/facility/CreateFacilities";
import FacilityForm from "../forms/facility/CreateFacility";

interface CreateNewFacilityProps {
    theme: string;
}

const CreateNewFacility: React.FC<CreateNewFacilityProps> = ({ theme }) => {
    const themeClasses =
        theme === "dark"
            ? "bg-dark-background text-dark-text"
            : "bg-light-background text-light-text";

    const cardTheme =
        theme === "dark"
            ? "bg-dark-secondary text-dark-text border-dark-border shadow-lg"
            : "bg-light-secondary text-light-text border-light-border shadow-md";

    const buttonPrimary =
        theme === "dark"
            ? "bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
            : "bg-blue-600 text-white hover:bg-blue-700 transition";

    const buttonSecondary =
        theme === "dark"
            ? "bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
            : "bg-green-600 text-white hover:bg-green-700 transition";

    const modalBackground =
        theme === "dark"
            ? "bg-gray-800 text-gray-200 border-gray-700"
            : "bg-white text-gray-900 border-gray-300";

    const [isFacilityModalOpen, setFacilityModalOpen] = useState(false);
    const [isFacilitiesModalOpen, setFacilitiesModalOpen] = useState(false);

    useEffect(() => {
        if (isFacilityModalOpen || isFacilitiesModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isFacilityModalOpen, isFacilitiesModalOpen]);

    return (
        <div className={`p-4 ${themeClasses} flex flex-col relative`}>
            {/* Explanation Section */}
            <div className="mb-4 text-center">
                <h1 className="text-xl font-semibold mb-5">Facility Management</h1>
                <p className="text-sm opacity-80">
                    Add a <strong>single facility manually</strong> or <strong>upload a bulk facilities list</strong>.
                </p>
            </div>

            <div className={`mb-6 text-start mx-10 p-6 rounded-lg border ${cardTheme}`}>
                {/* Header */}
                <h2 className="text-xl font-extrabold mb-3">📌 Bulk Facility Upload Guide</h2>
                <h3 className="text-md font-semibold opacity-90 mb-4">
                    Follow these steps to ensure a successful upload.
                </h3>

                {/* File Format */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                    <h4 className="text-md font-bold">✅ File Format</h4>
                    <p className="text-sm">
                        Ensure the file is in <span className="font-semibold">CSV, XLSX, or ODS</span> format.
                    </p>
                </div>

                {/* Required Fields */}
                <div className="mb-4">
                    <h4 className="text-md font-bold">✅ Required Fields</h4>
                    <p className="text-sm mb-2">
                        Your file must include the following facility details:
                    </p>

                    <div className="grid grid-cols-2 gap-x-10 text-sm">
                        {/* Left Column */}
                        <ul className="list-disc list-inside space-y-2 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                            <li><span className="font-semibold">Organization ID:</span> Unique identifier.</li>
                            <li><span className="font-semibold">Facility Name:</span> Official facility name.</li>
                            <li><span className="font-semibold">Facility County:</span> County location.</li>
                            <li><span className="font-semibold">Facility Town:</span> Town or city.</li>
                        </ul>

                        {/* Right Column */}
                        <ul className="list-square list-inside space-y-2 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                            <li><span className="font-semibold">Facility Street:</span> Street name.</li>
                            <li><span className="font-semibold">Physical Address:</span> Full address.</li>
                            <li><span className="font-semibold">Facility Postal Code:</span> Zip/postal code.</li>
                            <li><span className="font-semibold">Facility Phone:</span> Contact number.</li>
                            <li><span className="font-semibold">Facility Email:</span> Official email.</li>
                            <li><span className="font-semibold">Services Offered:</span> List of services.</li>
                        </ul>
                    </div>
                </div>

                {/* Data Accuracy */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-50">
                    <h4 className="text-md font-bold">✅ Data Accuracy</h4>
                    <p className="text-sm">
                        Ensure all required fields are correctly filled before uploading.
                    </p>
                </div>

                {/* Formatting */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-50">
                    <h4 className="text-md font-bold">✅ Formatting Rules</h4>
                    <p className="text-sm">
                        All details should be accurately entered to avoid validation errors.
                    </p>
                </div>

                {/* Upload Instructions */}
                <div className="mt-5 border-t pt-4">
                    <h4 className="text-md font-bold">📤 How to Upload</h4>
                    <p className="text-sm">
                        Drag & drop the file or click to select it. The system will validate the data before submission.
                    </p>
                </div>
            </div>

            {/* Buttons Section */}
            <div className="w-full flex space-x-4 mb-4 justify-center">
                <button
                    className={`px-5 py-2.5 font-semibold rounded-lg ${buttonPrimary}`}
                    onClick={() => setFacilityModalOpen(true)}
                >
                    + Add Facility
                </button>
                <button
                    className={`px-5 py-2.5 font-semibold rounded-lg ${buttonSecondary}`}
                    onClick={() => setFacilitiesModalOpen(true)}
                >
                    📂 Upload From File
                </button>
            </div>

            {/* Overlay */}
            {(isFacilityModalOpen || isFacilitiesModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            )}

            {/* Modals */}
            {isFacilityModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Create Facility</h2>
                        <FacilityForm theme={theme} />
                        <button
                            onClick={() => setFacilityModalOpen(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isFacilitiesModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Bulk Upload Facilities</h2>
                        <UploadBulkFacilities theme={theme} />
                        <button
                            onClick={() => setFacilitiesModalOpen(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateNewFacility;
