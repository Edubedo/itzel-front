import React, { useEffect, useState } from 'react'

function Areas() {
    type Area = {
    s_area: string;
    s_descripcion_area: string;
    // add other properties if needed
  };

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // Fetch areas data from API or other source
        const fetchAreas = async () => {
            const response = await fetch('http://localhost:3001/api/catalogos/areas/getAreas');
            const data = await response.json();
            console.log("data: ", data)
            setAreas(data.areas); 
        };

        fetchAreas();
    }, []);
  return (
    <div>
      <h1 className='text-lg'>Areas</h1>
      {areas.map((area, length) => (
        <div key={length}>{area?.s_area}</div>
      ))}
    </div>
  )
}

export default Areas    