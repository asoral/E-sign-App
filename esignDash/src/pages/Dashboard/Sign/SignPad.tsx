import React, { useRef, useState } from 'react';
import { Modal, Tabs } from 'antd';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureProps {
  onSave: (dataUrl: string) => void;
  onUpload: (imageUrl: string) => void;
  
}

const { TabPane } = Tabs;

const SignPad: React.FC<SignatureProps> = ({ onSave, onUpload }) => {
  const signatureRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleSave = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL();
      onSave(dataUrl);
      handleClear();
      setModalVisible(false);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setUploadedImage(imageDataUrl);
        onUpload(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
    closeModal();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setUploadedImage(imageDataUrl);
        onUpload(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
    closeModal();
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div>
        <button className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300" onClick={showModal}>Add Signature</button>
      </div>

<Modal

  open={modalVisible}
  onCancel={closeModal}
  footer={null}
  className="glass-modal"
>
  <div>
    <Tabs defaultActiveKey="1">
      {/* --- Tab 1: Draw Signature --- */}
      <TabPane
        tab={<span className="text-white font-semibold">Draw Signature</span>}
        key="1"
      >
        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{
            width: 420,
            height: 200,
            className: 'sigCanvas border border-gray-300 rounded bg-white/60 backdrop-blur-sm',
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={handleClear}
          >
            Clear Signature
          </button>
          <button
            className="bg-[#283C42] text-white px-4 py-2 rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300"
            onClick={handleSave}
          >
            Save Signature
          </button>
        </div>
      </TabPane>

      {/* --- Tab 2: Upload Signature --- */}
      <TabPane
        tab={<span className="text-white font-semibold">Upload Signature</span>}
        key="2"
      >
        <div
          className="w-full h-80 border-2 border-dashed border-white/50 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white hover:border-white/80 rounded-lg transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={handleImageUpload}
            />
            Drag & Drop or Click to Upload
          </label>
        </div>
      </TabPane>
    </Tabs>
  </div>
</Modal>

    </>
  );
};

export default SignPad;
