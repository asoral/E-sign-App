import React from 'react'
import { useRef, useState ,useEffect } from 'react';
import { Modal, Button, Tabs } from 'antd';
import { selectEmail , selectFullName } from '../../../redux/selectors/userSelector';
import { useSelector } from 'react-redux';
import SignPad from '../Sign/SignPad';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast ,Flip } from 'react-toastify';

const { TabPane } = Tabs;

interface SignatureSelectorProps {
  onSelect: (SelectedDataUrl: string , SelectedPemCert:string ,OpenSSLName:string) => void; 
  onClickbtn: () => void;
}
interface Signature {
  name: string;
  sign_blob: string;
  sign_name: string;
  user_mail: string;
  user_name: string;
  creation: string;
  cert: any;
  cert_pem: string;
  openssl_name : string;
}
interface ApiResponse {
  status: number;
  message: {
    data: Signature[];
  };
}


const SignInput: React.FC<SignatureSelectorProps> = ({ onSelect ,onClickbtn }:SignatureSelectorProps) => {
  const email = useSelector(selectEmail);
  const signatureRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [signName, setSignName] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [refreshSignatures, setRefreshSignatures] = useState<boolean>(false); 
  const fullName = useSelector(selectFullName);
  const [activeTabKey, setActiveTabKey] = useState<string>('1');

  const handleSaveSignature = (dataUrl: string) => {
    setRefreshSignatures(false);
    setSignatureData(dataUrl);
    setUploadedImage(null); 
  };

  const handleSignatureInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignName(e.target.value);
  };

  const handleSaveSignatureInDB = async () => {
    const signatureObject = {
      signature_data: signatureData || uploadedImage,
      signature_name: signName,
      user_full_name: fullName,
      user_email: email,
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
        setUploadedImage(null);
        setSignatureData(null);
        setSignName('');
        setRefreshSignatures(true); 
      } else {
        alert('Error saving signature: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the signature');
    }
    setActiveTabKey('1');
  };

  const handleUploadImage = (imageUrl: string) => {
    setRefreshSignatures(false);
    setUploadedImage(imageUrl);
    setSignatureData(null);
  };

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const response = await fetch(`/api/method/esign_app.api.get_signatures?user_mail=${email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result: ApiResponse = await response.json();
        if (response.status === 200) {
          setSignatures(result.message.data);
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n",result.message.data);
        } else {
        }
      } catch (error) {
      }
    };
  
    if (email || refreshSignatures) { 
      fetchSignatures();
    }
  }, [email,refreshSignatures ]);
  const showModal = () => {
    setModalVisible(true);
    onClickbtn();
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleSignatureClick = (signBlob: string , SelectedPemCert:string, OpenSSLName:string) => {
    onSelect(signBlob , SelectedPemCert,OpenSSLName);  
    closeModal();
  };

  return (
    <>
    <button 
      className="bg-[#283C42] w-full text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
      onClick={showModal}
    >Sign</button>
    

    <Modal
        title="Signature List"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          ,
        ]}
        width={'70vw'}
        
      ><div className='min-h-[60vh]'>

        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} >
          <TabPane tab="All Signatures" key="1">
        <div className='all-sign-div'>
        {signatures.map((signature, index) => (
            <div 
            key={index}
              className="card"
              onClick={() => handleSignatureClick(signature.sign_blob ,signature.cert_pem,signature.openssl_name )}
            >
              <img alt={`Signature ${index}`} src={signature.sign_blob}  className="card__image" />
              <div className="card__content">
                <p className="card__title">{signature.sign_name}</p>
                <p className="card__description">{new Date(signature.creation).toLocaleString()}</p>
              </div>
            </div>
        ))}
        </div>
          </TabPane>
          <TabPane tab="New Signature" key="2">
          <SignPad onSave={handleSaveSignature} onUpload={handleUploadImage} />
              {signatureData && (
            <div className="bg-gray-200 p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Signature Preview</h2>
              <img
                src={signatureData}
                alt="Signature"
                style={{ maxWidth: '100%', height: '90px' }}
                className="border border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2 mt-2 gap-1">
                <input
                  type="text"
                  className="border rounded px-4 py-2 h-10 focus:outline-none"
                  placeholder="Name of Signature"
                  value={signName || ''}
                  onChange={handleSignatureInput}
                />
                <button
                  onClick={handleSaveSignatureInDB}
                  className="bg-white text-[#283C42] px-4 py-2 rounded border-2 border-[#283C42] hover:bg-[#283C42] hover:text-white hover:border-transparent transition-colors duration-300"
                >
                  Save Signature
                </button>
              </div>
            </div>
          )}

          {uploadedImage && !signatureData && (
            <div className="bg-gray-200 p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Uploaded Image Preview</h2>
              <img
                src={uploadedImage}
                alt="Uploaded Image"
                style={{ maxWidth: '100%', height: 'auto' }}
                className="border border-gray-300 rounded"
              />
              <div className="flex items-center space-x-2 mt-2 gap-1">
                <input
                  type="text"
                  className="border rounded px-4 py-2 focus:outline-none"
                  placeholder="Name of Signature"
                  onChange={handleSignatureInput}
                />
                <button
                  onClick={handleSaveSignatureInDB}
                  className="bg-white text-[#283C42] px-4 py-2 rounded border-2 border-[#283C42] hover:bg-[#283C42] hover:text-white hover:border-transparent transition-colors duration-300"
                >
                  Save Signature
                </button>
              </div>
            </div>
          )}
          </TabPane>
        </Tabs>
      </div>
      </Modal>
   
    </>
  )
}

export default SignInput