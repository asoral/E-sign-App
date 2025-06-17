import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../../redux/selectors/userSelector';
import { ApiResponse, OpenSSLList } from '../helper/Interface';


interface OpenSSLAllListProps {
  refresh: boolean; // Indicates when to refresh
}


const OpenSSLAllList: React.FC<OpenSSLAllListProps> = ({ refresh }) => {
  const email = useSelector<string>(selectEmail);
  const [openSSLList, setOpenSSLList] = useState<OpenSSLList[]>([]);
  const [flags, setFlags] = useState<{ [key: string]: string }>({}); 

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
          setOpenSSLList(result.message.data);
        }
      } catch (error) {
        console.error("Error fetching OpenSSL list", error);
      }
    };

    fetchTemplates();
  }, [email ,refresh]);

  useEffect(() => {
    const fetchCountryFlags = async () => {
      const newFlags: { [key: string]: string } = {};
      for (const item of openSSLList) {
        if (item.country) {
          try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${item.country}`);
            const countryData = await response.json();
            const flagUrl = countryData[0]?.flags?.png || ''; // Get flag image URL
            if (flagUrl) {
              newFlags[item.country] = flagUrl;
            }
          } catch (error) {
            console.error("Error fetching flag for", item.country);
          }
        }
      }
      setFlags(newFlags);
    };

    if (openSSLList.length > 0) {
      fetchCountryFlags();
    }
  }, [openSSLList]);

  // Function to calculate expiry date
  const calculateExpiryDate = (timestamp: string) => {
    const dateMatch = timestamp.match(/utctime-(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{6})/);
    if (dateMatch) {
      const timestampDate = new Date(dateMatch[1]);
      timestampDate.setFullYear(timestampDate.getFullYear() + 1); // Add 365 days
      return timestampDate.toLocaleString();
    }
    return '';
  };

  return (
    <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
      <div className="flex flex-wrap gap-5">
        {openSSLList.map((item) => {
          const flagUrl = flags[item.country];
          const expiryDate = calculateExpiryDate(item.name); // Get the expiry date
          return (
            <div key={item.name} className="relative flex w-[200px] h-[100px]">
              <div className="absolute top-2 right-2 cursor-pointer">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-trash-2 text-red-600"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6l-2 14H7L5 6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                  <path d="M18 4l-1-1h-8L7 4"></path>
                </svg>
              </div>
              <div
                className="bg-[#283C42] text-white rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer p-4 relative"
                style={{ width: '200px', height: '100px' }}
              >
                <h3 className="mt-2 font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {item.openssl_name} {/* Display openssl_name */}
                </h3>
                <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                  ED: {expiryDate} {/* Display the calculated expiry date */}
                </p>
                <div className="absolute bottom-2 right-2">
                  {flagUrl && (
                    <img
                      src={flagUrl}
                      alt="Country Flag"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenSSLAllList;
