import React, { useState, useRef } from 'react'

interface Component {
  id: string
  name: string
  pageNo: number
  type: 'signature' | 'image' | 'checkbox' | 'm_date' | 'live_date' | 'fix_date' | 'text'
  assign?: string[]
  content?: string
  checked?: boolean
}

interface SignInputProps {
  onSelect: () => void
  onClickbtn: () => void
}

const SignInput: React.FC<SignInputProps> = ({ onSelect, onClickbtn }) => (
  <div>
    <button onClick={onSelect}>Select</button>
    <button onClick={onClickbtn}>Sign</button>
  </div>
)

export default function Component() {
  const [components, setComponents] = useState<Component[]>([
    { id: '1', name: 'Signature', pageNo: 0, type: 'signature', assign: ['user@example.com'] },
    { id: '2', name: 'Image Upload', pageNo: 1, type: 'image', assign: ['user@example.com'] },
    { id: '3', name: 'Checkbox', pageNo: 2, type: 'checkbox', assign: ['user@example.com'] },
    { id: '4', name: 'Date Input', pageNo: 3, type: 'm_date', assign: ['user@example.com'] },
    { id: '5', name: 'Text Input', pageNo: 4, type: 'text', assign: ['user@example.com'] },
  ])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const textInputRef = useRef<HTMLInputElement>(null)

  const email = 'user@example.com' // Simulated user email

  const handleSelectSignComp = () => {
    console.log('Signature component selected')
  }

  const handleModelSignComp = () => {
    console.log('Open signature model')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    console.log(`Image uploaded for component ${id}`)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, checked: e.target.checked } : comp
    ))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, content: e.target.value } : comp
    ))
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedId) {
      setComponents(components.map(comp => 
        comp.id === selectedId ? { ...comp, content: e.target.value } : comp
      ))
    }
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        <table className='w-full signer-table'>
          <thead>
            <tr className="bg-[#283C42] text-white">
              <th className="py-3 px-4 text-left">Sr.</th>
              <th className="py-3 px-4 text-left">Component</th>
              <th className="py-3 px-4 text-left">Page No.</th>
              <th className="py-3 px-4 text-left">Input</th>
            </tr>
          </thead>
          <tbody>
            {components
              .filter((component) => component.assign?.includes(email))
              .map((component, index) => (
                <tr
                  key={component.id}
                  className={`${selectedId === component.id ? 'selected-row bg-blue-100' : ''} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  onClick={() => {
                    setSelectedId(component.id)
                    setCurrentPage(component.pageNo)
                    handleModelSignComp()
                  }}
                >
                  <td className="py-2 px-4 border-b border-gray-200">{index + 1}</td>
                  <td
                    className="py-2 px-4 border-b border-gray-200"
                    onClick={() => {
                      setSelectedId(component.id)
                      // Note: This part would need adjustment in a real application
                      // const selectedElement = document.querySelector(`[data-id="${component.id}"]`);
                      // setTarget(selectedElement as HTMLElement);
                    }}
                  >
                    {component.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">{component.pageNo + 1}</td>
                  <td className="py-2 px-4 border-b border-gray-200 max-w-[18vw]">
                    {component.type === 'signature' && (
                      <SignInput onSelect={handleSelectSignComp} onClickbtn={handleModelSignComp} />
                    )}
                    {component.type === 'image' && (
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, component.id)} />
                    )}
                    {component.type === 'checkbox' && (
                      <input
                        type="checkbox"
                        checked={component.checked || false}
                        onChange={(e) => handleCheckboxChange(e, component.id)}
                      />
                    )}
                    {(component.type === 'm_date' || component.type === 'fix_date') && (
                      <input
                        type="date"
                        value={component.content || ''}
                        onChange={(e) => handleDateChange(e, component.id)}
                      />
                    )}
                    {component.type === 'live_date' && (
                      <input type="date" value={new Date().toISOString().split('T')[0]} readOnly />
                    )}
                    {component.type === 'text' && (
                      <input
                        className="bg-[#d1e0e4] text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        ref={textInputRef}
                        type="text"
                        value={component.content || ''}
                        onClick={() => {
                          setSelectedId(component.id)
                          setCurrentPage(component.pageNo)
                        }}
                        onChange={handleTextChange}
                        placeholder="Edit text here"
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}