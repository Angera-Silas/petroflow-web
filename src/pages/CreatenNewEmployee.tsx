import React, { useState, useEffect } from "react";
import EmployeeForm from "../forms/employee/CreateEmployee";
import CreateEmployees from "../forms/employee/CreateEmployees";

interface CreateNewEmployeeProps {
    theme: string;
}

const CreateNewEmployee: React.FC<CreateNewEmployeeProps> = ({ theme }) => {
    const themeClasses =
        theme === "dark"
            ? "bg-dark-background text-dark-text"
            : "bg-light-background text-light-text";

    const cardPrimary =
        theme === "dark"
            ? "bg-gray-800 text-gray-300 border-gray-700 shadow-lg"
            : "bg-gray-100 text-gray-900 border-gray-300 shadow-md";

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
                    Add a <strong>single employee manually</strong> or <strong>upload a bulk employee list</strong>.
                </p>
            </div>

            {/* Bulk Upload Guide */}
            <div className={`mb-6 text-start mx-10 p-6 rounded-lg border ${cardPrimary}`}>
                <h2 className="text-xl font-extrabold mb-3">📌 Bulk Employee Upload Guide</h2>
                <h3 className="text-md font-semibold opacity-90 mb-4">
                    Follow these steps to ensure a successful upload.
                </h3>

                {/* File Format */}
                <div className="mb-4 p-3 rounded-lg border border-opacity-50">
                    <h4 className="text-md font-bold">✅ File Format</h4>
                    <p className="text-sm opacity-80">
                        Ensure the file is in <span className="font-semibold text-blue-500">CSV, XLSX, or ODS</span> format.
                    </p>
                </div>

                {/* Required Fields */}
                <div className="mb-4">
                    <h4 className="text-md font-bold">✅ Required Fields</h4>
                    <p className="text-sm opacity-80 mb-2">
                        Your file must include the following employee details:
                    </p>

                    <div className="grid grid-cols-2 gap-x-10 text-sm">
                        {/* Left Column */}
                        <ul className="list-disc list-inside space-y-2 p-3 rounded-lg border border-opacity-50">
                            <li><span className="font-semibold">Email:</span> Official employee email.</li>
                            <li><span className="font-semibold">Firstname:</span> First name.</li>
                            <li><span className="font-semibold">Lastname:</span> Last name.</li>
                            <li><span className="font-semibold">ID Number:</span> National ID number.</li>
                            <li><span className="font-semibold">Employee No:</span> Unique employee identifier.</li>
                            <li><span className="font-semibold">Job Title:</span> Employee’s position.</li>
                            <li><span className="font-semibold">Employment Type:</span> Full-time, Part-time, Contract.</li>
                        </ul>

                        {/* Right Column */}
                        <ul className="list-disc list-inside space-y-2 p-3 rounded-lg border border-opacity-50">
                            <li><span className="font-semibold">Salary:</span> Monthly salary amount.</li>
                            <li><span className="font-semibold">NSSF No:</span> Social security number.</li>
                            <li><span className="font-semibold">NHIF No:</span> Health insurance number.</li>
                            <li><span className="font-semibold">KRA PIN:</span> Taxpayer identification number.</li>
                            <li><span className="font-semibold">Hire Date:</span> <span className="font-semibold text-blue-500">YYYY-MM-DD</span> format.</li>
                            <li><span className="font-semibold">Department:</span> Garage, Carwash, Sales, Accounts, IT.</li>
                            <li><span className="font-semibold">Role:</span> SYSTEM_ADMIN, RETAILER, HR_MANAGER, etc.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex space-x-4 mb-4 justify-center">
                <button
                    className={`px-5 py-2.5 font-semibold rounded-lg ${buttonPrimary}`}
                    onClick={() => setUserModalOpen(true)}
                >
                    + Add Employee
                </button>
                <button
                    className={`px-5 py-2.5 font-semibold rounded-lg ${buttonSecondary}`}
                    onClick={() => setUsersModalOpen(true)}
                >
                    📂 Upload From File
                </button>
            </div>

            {/* Overlay */}
            {(isUserModalOpen || isUsersModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            )}

            {/* Modals */}
            {isUserModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg border ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Create Employee</h2>
                        <EmployeeForm theme={theme} />
                        <button
                            onClick={() => setUserModalOpen(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isUsersModalOpen && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-3/4 max-w-4xl">
                    <div className={`p-6 rounded-lg shadow-lg border ${modalBackground}`}>
                        <h2 className="text-xl font-bold mb-4">Bulk Upload Employees</h2>
                        <CreateEmployees theme={theme} />
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

export default CreateNewEmployee;
