import React from "react";

interface AboutUsProps{
  theme: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ theme }) => {
  
  const themeClasses =
    theme === "dark"
      ? "bg-gray-700 text-gray-100"
      : "bg-gray-100 text-gray-900";
  const cardClasses =
    theme === "dark"
      ? "bg-gray-800 text-gray-200 shadow-lg"
      : "bg-white text-gray-900 shadow-md";

  return (
    <div className={`min-h-screen p-8 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">About PetroFlow</h1>
          <p className="text-lg text-gray-400">
            Transforming fuel station management with cutting-edge technology.
          </p>
        </div>

        {/* About PetroFlow */}
        <div className={`p-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-semibold mb-4">What is PetroFlow?</h2>
          <p>
            <strong>PetroFlow</strong> is a <em>comprehensive, technology-driven solution</em> designed to 
            <strong> streamline fuel station and service center operations</strong>. It offers a <em>seamless, automated, and transparent</em> 
            way to manage <strong>inventory, sales, employees, and customer interactions</strong>.
          </p>
        </div>

        {/* Mission Section */}
        <div className={`p-6 mt-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            To <strong>digitize and automate fuel station operations</strong>, providing <em>data-driven tools</em> that empower businesses 
            to <strong>increase efficiency, enhance customer experience, and improve decision-making</strong> through 
            <em> real-time analytics and automation</em>.
          </p>
        </div>

        {/* Values Section */}
        <div className={`p-6 mt-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>🚀 Innovation:</strong> Continuously advancing technology to tackle industry challenges.</li>
            <li><strong>🔍 Transparency:</strong> Promoting <em>honesty and accountability</em> in all operations.</li>
            <li><strong>🎯 Customer-Centricity:</strong> Delivering a <em>seamless user experience</em> tailored to business needs.</li>
            <li><strong>🤝 Collaboration:</strong> Working alongside <em>industry leaders and experts</em> to enhance service delivery.</li>
            <li><strong>🏆 Excellence:</strong> Striving for <em>high-quality, scalable solutions</em> that drive success.</li>
          </ul>
        </div>

        {/* Why Choose PetroFlow? */}
        <div className={`p-6 mt-6 rounded-lg ${cardClasses}`}>
          <h2 className="text-2xl font-semibold mb-4">Why Choose PetroFlow?</h2>
          <p className="mb-4">
            Whether managing a <strong>single station</strong> or <strong>multiple facilities</strong>, PetroFlow helps businesses 
            <strong> reduce inefficiencies, boost profitability, and ensure compliance</strong> with industry regulations.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>✅ <strong>Modern Tech Stack</strong> – Built with <em>React + Vite (Frontend) & Spring Boot (Backend)</em>.</li>
            <li>📊 <strong>Real-time Analytics</strong> – Track <em>sales, inventory, and staff performance effortlessly</em>.</li>
            <li>🖥️ <strong>User-Friendly UI/UX</strong> – Simple, intuitive design for smooth navigation.</li>
            <li>🔐 <strong>Secure & Reliable</strong> – Implements <em>top-tier security measures</em>.</li>
            <li>📈 <strong>Scalable & Customizable</strong> – Suitable for <em>small businesses & large petroleum enterprises</em>.</li>
          </ul>
        </div>

        {/* Meet the Developer */}
        <div className={`p-6 mt-6 rounded-lg ${cardClasses} text-center`}>
          <h2 className="text-2xl font-semibold mb-4">Meet the Developer</h2>
          <div className="flex flex-col items-center">
            <img
              src="src/assets/profile_pics/prof-angera.png"
              alt="Angera Silas"
              className="w-32 h-32 rounded-full shadow-lg mb-4 border-2 border-gray-500"
            />
            <p className="text-lg font-medium">Angera Silas</p>
            <p className="text-sm text-gray-400">Lead Developer & Visionary</p>
          </div>
          <p className="mt-4">
            <strong>Angera Silas</strong> is a <em>highly skilled developer</em> and the <strong>visionary behind PetroFlow</strong>.  
            With deep expertise in <em>React, Vite, Tailwind CSS, and Spring Boot</em>, he has built PetroFlow as a 
            <strong>scalable, high-performance, and user-friendly platform</strong>.  
            His passion for <em>enterprise solutions and digital transformation</em> fuels continuous innovation and improvement.
          </p>
        </div>

        {/* Closing Statement */}
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Join Us on Our Journey</h2>
          <p className="mb-4">
            PetroFlow is more than just software—it’s a <strong>movement towards digital transformation</strong> in the fuel and service industry.  
            We are committed to <strong>continuous innovation</strong> and <strong>enhancing operational efficiency</strong> for fuel station owners and managers.
          </p>
          <p className="text-lg font-bold text-blue-500">
            🚀 <strong>Let’s fuel the future together with PetroFlow!</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
