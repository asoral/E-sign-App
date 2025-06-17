import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmail } from '../../../redux/selectors/userSelector';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';

interface Templete {
    name: string;
    templete_title: string;
    templete_owner_email: string;
    templete_owner_name: string;
    templete_created_at: string;
}

interface ApiResponse {
    status: number;
    message: {
        data: Templete[];
    };
}

interface AllTempletesProps {
    refreshTempletes: boolean;
    setRefreshTempletes: Dispatch<SetStateAction<boolean>>;
}

const TempleteAllList: React.FC<AllTempletesProps> = ({ refreshTempletes, setRefreshTempletes }) => {
    const navigate = useNavigate();
    const email = useSelector(selectEmail);

    const [templetes, setTempletes] = useState<Templete[]>([]);
    const [filteredTempletes, setFilteredTempletes] = useState<Templete[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [filterText, setFilterText] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [selectedTemplete, setSelectedTemplete] = useState<Templete | null>(null);

    useEffect(() => {
        const fetchTempletes = async () => {
            try {
                const response = await fetch(`/api/method/esign_app.api.get_templetes?user_mail=${email}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const result: ApiResponse = await response.json();

                if (response.status === 200) {
                    setTempletes(result.message.data);
                    setFilteredTempletes(result.message.data);
                } else {
                    setError('Failed to fetch templates');
                }
            } catch (error) {
                setError('An error occurred while fetching templates');
            } finally {
                setLoading(false);
            }
        };

        if (email || refreshTempletes) {
            fetchTempletes();
        }
    }, [email, refreshTempletes]);

    // Filter Logic - Called on every input change
    useEffect(() => {
        applyFilters();
    }, [filterText, dateFrom, dateTo, templetes]);

    const applyFilters = () => {
        const filtered = templetes.filter((templete) => {
            const titleMatch = templete.templete_title.toLowerCase().includes(filterText.toLowerCase());

            const createdAt = new Date(templete.templete_created_at).toISOString().split('T')[0];
            const fromCheck = dateFrom ? createdAt >= dateFrom : true;
            const toCheck = dateTo ? createdAt <= dateTo : true;

            return titleMatch && fromCheck && toCheck;
        });

        setFilteredTempletes(filtered);
    };

    const handleEdit = (templete: Templete) => {
        navigate(`/templete/${templete.name}`, { state: { templete } });
    };

    const showDeleteModal = (templete: Templete) => {
        setSelectedTemplete(templete);
        setDeleteModalVisible(true);
    };

    const handleDelete = async (name: string) => {
        try {
            const response = await fetch(`/api/method/esign_app.api.delete_esign_templete?user_mail=${email}&name=${name}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const updatedTempletes = templetes.filter((t) => t.name !== name);
                setTempletes(updatedTempletes);
                setRefreshTempletes(true);
            }
        } catch (error) {
            setError('Error deleting template');
        } finally {
            setDeleteModalVisible(false);
        }
    };

    const handleShowAll = () => {
        setFilterText('');
        setDateFrom('');
        setDateTo('');
        setFilteredTempletes(templetes);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative mt-6 min-w-[1000px] max-w-[1000px] mx-auto">
            {/* Filter Row */}
            <div className="flex items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search Templates"
                    className="p-2 rounded bg-[#283C42] text-white placeholder-gray-400 w-1/3"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <input
                    type="date"
                    className="p-2 rounded bg-[#283C42] text-white"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                />
                <input
                    type="date"
                    className="p-2 rounded bg-[#283C42] text-white"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                />
                <button
                    className="bg-[#283C42] text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-[#283C42] transition"
                    onClick={handleShowAll}
                >
                    Show All
                </button>
            </div>

            {/* Template Grid */}
            <div className="flex flex-wrap gap-5">
                {filteredTempletes.map((templete, index) => (
                    <div key={index} className="relative flex w-[200px] h-[100px]">
                        <div
                            className="absolute top-2 right-2 cursor-pointer"
                            onClick={() => showDeleteModal(templete)}
                        >
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
                            className="bg-[#283C42] text-white rounded border-2 border-transparent hover:border-[#283C42] hover:bg-white hover:text-[#283C42] transition-colors duration-300 cursor-pointer p-4"
                            style={{ width: '200px', height: '100px' }}
                            onClick={() => handleEdit(templete)}
                        >
                            <h3 className="mt-2 font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                                {templete.templete_title}
                            </h3>
                            <p className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                                {new Date(templete.templete_created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTemplete && (
                <ConfirmDeleteModal
                    visible={deleteModalVisible}
                    name={selectedTemplete.name}
                    message={`Are you sure you want to delete "${selectedTemplete.templete_title}"?`}
                    module="Template"
                    onCancel={() => setDeleteModalVisible(false)}
                    onConfirm={() => handleDelete(selectedTemplete.name)}
                />
            )}
        </div>
    );
};

export default TempleteAllList;
