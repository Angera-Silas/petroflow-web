import React, { useState, useEffect } from "react";
import CreateUserForm from "../forms/users/CreateUser";
import CreateUsersForm from "../forms/users/CreateUsers";

interface CreateNewUserProps {
    theme: string;
}

const CreateNewUser: React.FC<CreateNewUserProps> = ({ theme }) => {
    const themeClasses =
        theme === "dark"
            ? "bg-dark-background text-dark-text"
            : "bg-light-background text-light-text";

    const cardTheme =
        theme === "dark"
            ? "bg-dark-secondary text-dark-text  shadow-lg"
            : "bg-light-secondary text-light-text  shadow-md";

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

    const overlayBackground = "bg-black bg-opacity-10";

    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isUsersModalOpen, setUsersModalOpen] = useState(false);

    useEffect(() => {
        if (isUserModalOpen || isUsersModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isUserModalOpen, isUsersModalOpen]);

    return (
        <div className={`p-4 ${themeClasses} flex flex-col relative`}>
            {/* Explanation Section */}
            <div className="mb-4 text-center">
                <h1 className="text-xl font-semibold mb-5">User Management</h1>
                <p className="text-sm opacity-80">
                    Add a <strong>single user manually</strong> or <strong>upload a bulk user list</strong>.
                </p>
            </div>

            {/* Bulk Upload Guide */}
            <div className={`mb-6 text-start mx-10 p-6 rounded-lg border ${cardTheme}`}>
                <h2 className="text-xl font-extrabold mb-3">📌 Bulk User Upload Guide</h2>
                <h3 className="text-md font-semibold opacity-90 mb-4">
                    Follow these steps to ensure a successful upload.
                </h3>

                {/* File Format */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                    <h4 className="text-md font-bold">✅ File Format</h4>
                    <p className="text-sm">
                        Ensure the file is in <strong>CSV, XLSX, or ODS</strong> format.
                    </p>
                </div>

                {/* Required Fields */}
                <div className="mb-4">
                    <h4 className="text-md font-bold">✅ Required Fields</h4>
                    <p className="text-sm mb-2">
                        Your file must include the following user details:
                    </p>

                    <div className="grid grid-cols-2 gap-x-10 text-sm">
                        {/* Left Column */}
                        <ul className="list-disc list-inside space-y-2 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                            <li><span className="font-semibold">First Name</span></li>
                            <li><span className="font-semibold">Last Name</span></li>
                            <li><span className="font-semibold">ID Number</span></li>
                            <li><span className="font-semibold">Date of Birth</span></li>
                        </ul>

                        {/* Right Column */}
                        <ul className="list-square list-inside space-y-2 p-3 rounded-lg bg-opacity-20 border border-opacity-20">
                            <li><span className="font-semibold">Email</span></li>
                            <li><span className="font-semibold">Phone Number</span></li>
                            <li><span className="font-semibold">Role</span></li>
                            <li><span className="font-semibold">Gender</span></li>
                        </ul>
                    </div>
                </div>

                {/* Data Accuracy */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-20">
                    <h4 className="text-md font-bold">✅ Data Accuracy</h4>
                    <p className="text-sm">
                        Ensure all required fields are correctly filled before uploading.
                    </p>
                </div>

                {/* Duplicate Handling */}
                <div className="mb-4 p-3 rounded-lg bg-opacity-20">
                    <h4 className="text-md font-bold">✅ Duplicate Handling</h4>
                    <p className="text-sm">
                        Each user must have a unique email. Existing users will be skipped.
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
                    onClick={() => setUserModalOpen(true)}
                >
                    + Add Single User
                </button>
                <button
                    className={`px-5 py-2.5 font-semibold rounded-lg ${buttonSecondary}`}
                    onClick={() => setUsersModalOpen(true)}
                >
                    📂 Bulk Upload Users
                </button>
            </div>

            {/* Overlay */}
            {(isUserModalOpen || isUsersModalOpen) && (
                <div className={`fixed inset-0 z-40 ${overlayBackground}`}></div>
            )}

            {/* Single User Modal */}
            {isUserModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Create User</h2>
                        <CreateUserForm theme={theme} />
                        <button
                            onClick={() => setUserModalOpen(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {isUsersModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Bulk Upload Users</h2>
                        <CreateUsersForm theme={theme} />
                        <button
                            onClick={() => setUsersModalOpen(false)}
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

export default CreateNewUser;
