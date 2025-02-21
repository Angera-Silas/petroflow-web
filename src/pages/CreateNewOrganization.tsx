// Desc: Create a new organization page
import NewOrganizationForm from "../forms/org/CreateOrganization"; 

interface OrganizationPageProps {
  theme: string;
}

const AddOrganizationPage: React.FC<OrganizationPageProps> = ({ theme }) => {
  
  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>

      {/* Organization Form */}
      <div className="max-w-4xl  mx-auto p-6 rounded-lg">
        <NewOrganizationForm theme={theme} />
      </div>
    </div>
  );
};

export default AddOrganizationPage;