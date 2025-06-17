import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { selectFullName, selectEmail } from '../../../redux/selectors/userSelector';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface OpenSSLButtonProps {
  onAdd: () => void; 
}

const OpenSSLButton: React.FC<OpenSSLButtonProps> = ({ onAdd }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    location: '',
    organization: '',
    challenge_password: '',
    countryCode: '',
    username: '',
    email: '',
    openssl_name:'',
  });
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<{ name: string; code: string }[]>([]);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  const fullName = useSelector(selectFullName);
  const email = useSelector(selectEmail);

  useEffect(() => {
    // Pre-fill username and email
    setFormData((prev) => ({
      ...prev,
      username: fullName,
      email: email
    }));

    async function fetchCountries() {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        const data = await response.json();
        const countryData = data
          .map((country: any) => ({ name: country.name.common, code: country.cca2 }))
          .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
        setCountries(countryData);
        setFilteredCountries(countryData);
      } catch (error) {
        toast.error('Error fetching countries!', { transition: Flip });
      }
    }

    fetchCountries();
  }, [fullName, email]);


  const showModal = () => {
    setModalVisible(true);
  };
  const clearDataFields = () =>{
       setFormData({
      country: '',
      state: '',
      location: '',
      organization: '',
      challenge_password: '',
      countryCode: '',
      username: fullName,
      email: email,
      openssl_name:'',
    });
  }
  const closeModal = () => {
    setModalVisible(false);
    clearDataFields();
  };
  const handleSave= async()=>{
    setButtonDisable(true);
    console.log(formData)
    try {
      const response = await fetch('/api/method/esign_app.api.genrate_and_store_keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);
      if (result.message.status < 300) {
        toast.success('OpenSSL created Successfully', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        });
        onAdd();
        setModalVisible(false);
        setButtonDisable(false);
        clearDataFields();
      } else {
        toast.error('Error while creating OpenSSL', {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        });
        setButtonDisable(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the templete');
    }
    setButtonDisable(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'challenge_password') {
        // Validate Challenge Password: At least 1 uppercase, 1 digit, no special symbols
        const validPassword = /^[A-Za-z0-9]*$/;
        if (!validPassword.test(value)) return;
      }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-update countryCode when country changes
    if (name === 'country') {
      const selectedCountry = countries.find((c) => c.name === value);
      setFormData((prev) => ({ ...prev, countryCode: selectedCountry ? selectedCountry.code : '' }));
    }
  };



  return (
    <>
      <div>
        <button
          className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
          onClick={showModal}
        >
          Add OpenSSL
        </button>
      </div>
 <Modal
  title="Add Template"
  open={modalVisible}
  onCancel={closeModal}
  rootClassName="glass-modal"
  footer={[
    <div key="footer-buttons" className="flex justify-end gap-2 px-4 pb-4">
      <button
        disabled={buttonDisable}
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#ca2424] hover:bg-white hover:text-[#ca2424] transition-colors duration-300"
        onClick={closeModal}
      >
        Cancel
      </button>
    </div>,
  ]}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 pb-2 text-white">
    {/* Country + Code */}
    <div>
      <label className="block text-xs font-semibold mb-1">Country</label>
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        className="w-full bg-white/20 text-white placeholder:text-white/60 backdrop-blur-md border border-white/30 rounded py-2 px-3 text-sm"
      >
        <option value="">Select Country</option>
        {filteredCountries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-xs font-semibold mb-1">Country Code</label>
      <input
        type="text"
        name="countryCode"
        value={formData.countryCode}
        readOnly
        className="w-full bg-white/10 text-white backdrop-blur border border-white/30 rounded py-2 px-3 text-sm"
      />
    </div>

    {/* Next fields */}
    {[
      { label: "OpenSSL Name", name: "openssl_name" },
      { label: "State/Province", name: "state" },
      { label: "Location", name: "location" },
      { label: "Organization", name: "organization" },
      { label: "Challenge Password", name: "challenge_password", placeholder: "Ex. Pass123" },
      { label: "Username", name: "username", readOnly: true },
      { label: "Email", name: "email", readOnly: true },
    ].map(({ label, name, placeholder, readOnly }) => (
      <div key={name} className={name === 'organization' ? "md:col-span-2" : ""}>
        <label className="block text-xs font-semibold mb-1">{label}</label>
        <input
          type="text"
          name={name}
          value={formData[name]}
          placeholder={placeholder}
          onChange={handleChange}
          readOnly={readOnly}
          className={`w-full ${readOnly ? "bg-white/10" : "bg-white/20"} text-white placeholder:text-white/60 backdrop-blur-md border border-white/30 rounded py-2 px-3 text-sm`}
        />
      </div>
    ))}
  </div>
</Modal>


      <ToastContainer limit={1} />
    </>
  );
}

export default OpenSSLButton;
