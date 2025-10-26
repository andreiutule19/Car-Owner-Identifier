import React, { createContext, useContext, useState } from 'react';

const ObjectContext = createContext();

export const ObjectProvider = ({ children }) => {
  const [objects, setObjects] = useState([]);

    const addObject = (newObject) => {
        console.log("NEW OBJECT",newObject)
        setObjects([... objects,newObject]);
        console.log("AICI",objects)
  };
  const deleteObject = (index) => {
    setObjects((prevObjects) => {
      const updatedObjects = [...prevObjects];
      updatedObjects.splice(index, 1);
      return updatedObjects;
    });
  };
  return (
    <ObjectContext.Provider value={{ objects, addObject,deleteObject }}>
      {children}
    </ObjectContext.Provider>
  );
};

export const useObjectContext = () => useContext(ObjectContext);
