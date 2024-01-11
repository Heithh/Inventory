import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveBar } from "@nivo/bar";
import { getAnalysis } from "../../api/getAnalysis";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

// TS interface for a single entry in the analysis data
interface RawDataItem {
  origin: string;
  value: { [key: string]: number };
  insight_name: string;
}

//TS interface for the analysis data
interface AnalysisEntry {
  origin: string;
  [key: string]: number | string;
}

const Analysis = () => {
  const { modelName } = useParams<{ modelName: string }>();
  const [data, setData] = useState<AnalysisEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAnalysis(modelName!); //modelName never null
        if (response.data) {
          const transformedData = transformData(
            response.data[0] as RawDataItem[],
          );
          setData(transformedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modelName]);

  // Transform the raw data to the format expected by the NIVO bar chart
  const transformData = (rawData: RawDataItem[]): AnalysisEntry[] => {
    return rawData
      .filter((item) => item.insight_name === "variable_ranking")
      .map((item) => {
        const transformed: AnalysisEntry = { origin: item.origin };
        Object.entries(item.value).forEach(([key, value]) => {
          transformed[key] = (value * 100).toFixed(2);
        });
        return transformed;
      });
  };

  //Render a loading spinner while data is being fetched from API
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader color="#09f" />
      </div>
    );
  }

  //Handle Go Back click
  const handleBackClick = () => {
    navigate(`/inventory`);
  };

  return (
    <div className="container mx-auto p-4">
      <div
        onClick={handleBackClick}
        className="absolute top-20 left-4 flex items-center hover:cursor-pointer hover:scale-125 transition duration-300 ease-in-out"
      >
        <IoChevronBackOutline size={30} />
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center p-5">{modelName}</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full md:w-2/3 rounded-lg sm:p-6  h-96 overflow-auto shadow-lg border border-blue-300 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
          <ResponsiveBar
            data={data}
            keys={[
              "PetalWidthCm",
              "SepalWidthCm",
              "PetalLengthCm",
              "SepalLengthCm",
            ]}
            indexBy="origin"
            label={(barData) => `${barData.value}%`}
            margin={{ top: 50, right: 130, bottom: 50, left: 100 }}
            padding={0.3}
            groupMode="grouped"
            layout="horizontal"
            valueScale={{ type: "linear", min: 0, max: 100 }}
            indexScale={{ type: "band", round: true }}
            colors={["#92d2f9", "#a8daf9", "#7297d6", "#89badf"]}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Percent %",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Values",
              legendPosition: "middle",
              legendOffset: -70,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 5.5]] }}
            theme={{
              labels: {
                text: {
                  fontWeight: 550,
                },
              },
            }}
            tooltip={({ id, value, color }) => (
              <div
                className="backdrop-blur-md py-1 px-2 rounded-lg border border-gray-300"
                style={{
                  background: color,
                  color: "black",
                  opacity: 0.9,
                }}
              >
                {id} : {value}%
              </div>
            )}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
