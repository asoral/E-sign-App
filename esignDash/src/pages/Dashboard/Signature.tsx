import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
// import { KEYUTIL } from 'jsrsasign';
// import { pki } from 'node-forge';
// import forge from 'node-forge';
import SignPad from './Sign/SignPad';
import { selectFullName, selectEmail } from '../../redux/selectors/userSelector';
import AllSignatures from './Sign/AllSignatures';
import 'react-toastify/dist/ReactToastify.css';
import {  toast ,Flip } from 'react-toastify';
// import { CertificateSigned } from './helper/SignedCertificate'
import { BLANK_PDF_BASE64 } from './helper/Constents';
import { ApiResponse, OpenSSLList } from './helper/Interface';
// import { validateSelfSignedCertificate , generateSelfSignedCertificate } from './helper/certificateGenerator';

// interface Keys {
//   publicKey: string | null;
//   privateKey: string | null;
//   certificate: CertificateSigned | null;
//   cert_pem : string | null;
// }



function Signature() {
  // const [publicKey, setPublicKey] = useState<string | null>(null);
  // const [privateKey, setPrivateKey] = useState<string | null>(null);
  // const [certificate, setCertificate] = useState<CertificateSigned | null>(null);
  // const [keys,setKeys] = useState<Keys | null>({
  //   publicKey: null,
  //   privateKey: null,
  //   certificate: null,
  //   cert_pem : null,
  // });

  // const [formData, setFormData] = useState({
  //   companyName: '',
  //   department: '',
  //   state: '',
  //   country: '',
  // });
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [signName, setSignName] = useState<string | null>(null);
  
  const [selectedValue, setSelectedValue] = useState(null);
  const [opensslName, setOpensslName] = useState('');

  const [refreshSignatures, setRefreshSignatures] = useState<boolean>(false);  
  const fullName = useSelector(selectFullName);
  const email = useSelector(selectEmail);
  const [openSSLList, setOpenSSLList] = useState<OpenSSLList[]>([]);

  //Ftch Fn 
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_openssl_list?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result: ApiResponse = await response.json();
        if (result.message.status === 200) {
          console.log('open SSl data',result.message.data)
          setOpenSSLList(result.message.data);
        }else{
          console.log("failed to set Open SSL data",result.message.data)
        }
        
      } catch (error) {
        console.error("Error fetching OpenSSL list", error);
      }
    };

    fetchTemplates();
  }, [email]);


  const calculateExpiryDate = (timestamp: string) => {
    const dateMatch = timestamp.match(/utctime-(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{6})/);
    if (dateMatch) {
      const timestampDate = new Date(dateMatch[1]);
      timestampDate.setFullYear(timestampDate.getFullYear() + 1); // Add 1 year
  
      // Format to MySQL DATETIME: YYYY-MM-DD HH:MM:SS
      const year = timestampDate.getFullYear();
      const month = String(timestampDate.getMonth() + 1).padStart(2, '0');
      const day = String(timestampDate.getDate()).padStart(2, '0');
      const hours = String(timestampDate.getHours()).padStart(2, '0');
      const minutes = String(timestampDate.getMinutes()).padStart(2, '0');
      const seconds = String(timestampDate.getSeconds()).padStart(2, '0');
  
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return '';
  };
  
  const handleClearAll = () =>{
    setSignatureData(null);
    setUploadedImage(null);
    setSignName(null);

  }
  // useEffect(() => {
  //   console.log("use effect for keys ran");
  
  //   if (!keys?.publicKey) return;  
  //   handleSaveSignatureInDB();
  // }, [keys]);
  

  // const generateKeys = async () => {
  //   try {
  //     console.log('Generating RSA keys...');
  //     const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(2048);
  //     const publicKeyPem = forge.pki.publicKeyToPem(publicKey);
  //     const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
  //     console.log('After RSA keys...');
  //     const cert = forge.pki.createCertificate();
  //     cert.publicKey = publicKey;
  //     cert.serialNumber = String(Date.now()); 
  //     cert.validFrom = new Date();
  //     cert.validTo = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  //     cert.setSubject([
  //       { name: 'commonName', value: fullName },
  //       { name: 'organizationName', value: formData.companyName },
  //       { name: 'countryName', value: formData.country },
  //       { name: 'emailAddress', value: email },
  //       { name: 'stateOrProvinceName', value: formData.state }
  //     ]);
  //     const sha256 = forge.md.sha256.create();
  //     cert.sign(privateKey, sha256);

  //     const certPem = forge.pki.certificateToPem(cert);
  //     console.log('Certificate PEM:', certPem);
  //     // Set use State values 
  //     console.log("\n Public",publicKeyPem,"\n Private" , privateKeyPem);
      
  //     // await setCertificate(cert);
  //     // await setPublicKey(publicKeyPem);
  //     // await setPrivateKey(privateKeyPem);
  //     setKeys({ publicKey: publicKeyPem, privateKey: privateKeyPem, certificate: cert , cert_pem : certPem });


  //     console.log('Certificate generated successfully!');
      
  //   } catch (error) {
  //     console.error('Error generating keys:', error);
  //   }
  // };

  const handleSaveSignature = (dataUrl: string) => {
    setRefreshSignatures(false);
    setSignatureData(dataUrl);
    setUploadedImage(null); 
  };
  // const handleInputChange = (e: any) => {
  //   const { name, value } = e.target;
  //   setFormData(prevData => ({ ...prevData, [name]: value }));
  // };
  const handleSignatureInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formattedValue = newValue.replace(/\s{2,}/g, ' ');
    setSignName(formattedValue);
  };
  
  const handleSaveSignatureInDB = async () => {
      console.log(signatureData)
    if(signatureData===BLANK_PDF_BASE64)
    {
      toast.error('Blank Sign-Pad', {
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
      return;
    }
    
    if(signName=='' || signName==null)
    {
      toast.error('Enter Sign Name', {
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
      return;
    }
    if(signName.length < 4)
      {
        toast.error('At Least 4 Words Needed', {
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
        return;
      }
      if(selectedValue=='' || selectedValue==null)
        {
          toast.error('Select OpenSSL Certificate', {
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
          return;
        }
    const signatureObject = {
      signature_data: signatureData || uploadedImage,
      signature_name: signName,
      user_full_name: fullName,
      user_email: email,
      openssl_name : selectedValue,
      expiry_date : calculateExpiryDate(selectedValue)

    };
    try {
      const response = await fetch('/api/method/esign_app.api.save_signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signatureObject),
      });
  
      const result = await response.json();
  
      if (result.message.status < 300) {
        // alert('Signature saved successfully');
        toast.success('Sign Created Successfully', {
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
          handleClearAll();
        
        setRefreshSignatures(true); 
      } else {
        alert('Error saving signature: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the signature');
    }
  };

  const handleUploadImage = (imageUrl: string) => {
    setRefreshSignatures(false);
    setUploadedImage(imageUrl);
    setSignatureData(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (uploadedImage!=null || signatureData!==null)) {
        handleSaveSignatureInDB(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [uploadedImage,signatureData ,signName]);

  const handleChange = (selectedOption:any) => {
    console.log(calculateExpiryDate(selectedOption.value));
    setSelectedValue(selectedOption ? selectedOption.value : null);
  };

    // const handleOpensslNameInput = (e:any) => {
    //   setOpensslName(e.target.value);
    // };


  const dropdownOptions = openSSLList.map(item => ({
    value: item.name,
    label: item.openssl_name
  }));

  return (
    <div className=" mx-auto mt-8">
      <SignPad onSave={handleSaveSignature} onUpload={handleUploadImage} />
      
      { (signatureData || uploadedImage) && ( 
        <div className="bg-gray-200 p-4 mt-4 flex flex-col">
        {signatureData ? (
          <>
            <div>
              <h2 className="text-lg font-semibold mb-2">Signature Preview</h2>
              <img
                src={signatureData}
                alt="Signature"
                style={{ maxWidth: '100%', height: '250px' }}
                className="border border-gray-300 rounded"
                />
            </div>
          </>
        ) : uploadedImage ? (
          <>
          <div>
            <h2 className="text-lg font-semibold mb-2">Uploaded Image Preview</h2>
            <img
              src={uploadedImage}
              alt="Uploaded Image"
              style={{ maxWidth: '100%', height: '250px' }}
              className="border border-gray-300 rounded"
              />
          </div>
          </>
        ) : null}
      <div className='p-5'>
        <div>
        {/* <form className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-2 py-1 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  px-2 py-1 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  px-2 py-1 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  px-2 py-1 focus:outline-none"
            />
          </div>

        </form> */}
        </div>

              <div className="flex items-center space-x-2 mt-2 gap-1">
                <input
                  type="text"
                  className="border rounded px-4 py-2 h-10 focus:outline-none"
                  placeholder="Name of Signature"
                  value={signName || ''}
                  onChange={handleSignatureInput}
                />
                  <Select
        options={dropdownOptions}
        onChange={handleChange}
        placeholder="Search and select"
        className="w-64"
        classNamePrefix="custom-dropdown"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#283C42',
            borderRadius: '0.375rem',
            height: '40px',
            padding: '0 10px',
          }),
          menu: (base) => ({
            ...base,
            borderRadius: '0.375rem',
            borderColor: '#283C42',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#283C42' : state.isFocused ? '#f1f1f1' : 'white',
            color: state.isSelected ? 'white' : '#283C42',
            padding: '10px',
          }),
        }}
      />
                <button
                  onClick={handleSaveSignatureInDB}
                  className="bg-white text-[#283C42] px-4 py-2 rounded border-2 border-[#283C42] hover:bg-[#283C42] hover:text-white hover:border-transparent transition-colors duration-300"
                  >
                  Save Signature
                </button>
              </div>

            </div>
            </div>
      )}
      

      {/* <ToastContainer limit={1}/> */}
      <AllSignatures refreshSignatures={refreshSignatures} setRefreshSignatures={setRefreshSignatures} />
    </div>
  );
}

export default Signature;
