import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModels } from '../../api/getModels';
import { MoonLoader } from 'react-spinners';

//TS Interface for a model
interface Model {
  model_name: string;
  model_type: string;
}

const Inventory = () => {

  //States to store data
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Hook to fetch model data from local API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getModels();
        setModels(response.data);
        setLoading(response.loading);
      } catch (error) {
        console.error('Failed to fetch models', error);
      }
    };
    fetchData();
  }, []);

  //Function to handle click on models
  const handleModelClick = (modelName: string) => {
    navigate(`/analysis/${modelName}`);
  };


  //Render a loading spinner while data is being fetched from API
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader color="#09f" />
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center p-5"> Models Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {models.map((model) => (
          <div
            key={model.model_name}
            className="border p-4 rounded shadow transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer hover:border-blue-500"
            onClick={() => handleModelClick(model.model_name)}
          >
            <div className="text-center mb-2">
              <span className="text-lg block">{model.model_name}</span>
              <span className="text-sm bg-blue-200 px-2 py-1 rounded">{model.model_type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default Inventory;
