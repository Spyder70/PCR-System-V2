import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const DraggableBlock = ({ id, formIndex, name, type, index, moveBlock, isRequired, numButtons, buttonNames, options }) => {
  const [, drag] = useDrag({
    type: 'BLOCK',
    item: { id, formIndex, index },
  });

  const [, drop] = useDrop({
    accept: 'BLOCK',
    hover(item, monitor) {
      if (!drag) {
        return;
      }
      if (item.formIndex !== formIndex || item.index === index) {
        return;
      }
      moveBlock(item.index, index, formIndex);
      item.index = index;
    },
  });

  const isFormname = type === 'formname';
  const isButton = type === 'button';
  const isCheckbox = type === 'checkbox';
  const isRadio = type === 'radio';
  const isDropdown = type === 'dropdown';

  return (
    <div
      ref={(node) => (isFormname ? null : drag(drop(node)))}
      className={`draggable-block ${isButton ? 'button-block' : ''} ${isFormname ? 'formname-block' : ''} ${isCheckbox ? 'checkbox-block' : ''} ${isRadio ? 'radio-block' : ''} ${isDropdown ? 'dropdown-block' : ''}`}
      style={{ border: isButton || isFormname ? 'none' : '' }}
    >
      {isFormname ? (
        <label className={`formname-label ${isRequired ? 'required-field' : ''}`}>{name}</label>
      ) : isButton ? (
        <div className="button-wrapper">
          <button>{name}</button>
        </div>
      ) : (
        <>
          <p>
            {name}
            {isRequired && <span className="required-star">*</span>}
          </p>
          {isCheckbox || isRadio ? (
            <div className={`option-row ${isCheckbox ? 'checkbox-row' : 'radio-row'}`}>
              {Array.from({ length: numButtons }, (_, buttonIndex) => (
                <div key={buttonIndex} className="option-item">
                  <input type={isCheckbox ? 'checkbox' : 'radio'} id={`button_${index}_${buttonIndex}`} name={`button_${index}`} />
                  <label htmlFor={`button_${index}_${buttonIndex}`}>{buttonNames[buttonIndex]}</label>
                </div>
              ))}
            </div>
          ) : isDropdown ? (
            <div>
              <select>
                {options.map((option, optionIndex) => (
                  <option key={optionIndex}>{option}</option>
                ))}
              </select>
            </div>
          ) : (
            <input type={type} placeholder={`Enter ${type} here`} required={isRequired} />
          )}
        </>
      )}
    </div>
  );
};

const AddForm = () => {
  const [forms, setForms] = useState([]);
  const [activeFormIndex, setActiveFormIndex] = useState(null);
  const [blockName, setBlockName] = useState('');
  const [blockType, setBlockType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [numButtons, setNumButtons] = useState(0);
  const [buttonNames, setButtonNames] = useState(Array(numButtons).fill(''));
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim() !== '') {
      setOptions([...options, newOption]);
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  const setNumButtonsAndUpdateNames = (newNumButtons) => {
    newNumButtons = parseInt(newNumButtons);
    if (isNaN(newNumButtons) || newNumButtons < 0) {
      alert('Please enter a valid positive integer for the number of buttons.');
      return;
    }

    const newButtonNames = Array(newNumButtons).fill('').map((_, index) => buttonNames[index] || '');
    setNumButtons(newNumButtons);
    setButtonNames(newButtonNames);
  };

  const addBlock = () => {
    if (activeFormIndex === null) {
      alert('Please add a form first then you can add blocks.');
      return;
    }

    if (
      blockName.trim() === '' ||
      blockType.trim() === '' ||
      (blockType !== 'formname' && blockType !== 'button' && isRequired === '')
    ) {
      alert('Please fill in all the fields.');
      return;
    }

    const isButtonAlreadyAdded = forms[activeFormIndex].blocks.some((block) => block.type === 'button');
    if (blockType === 'button' && isButtonAlreadyAdded) {
      alert('Only one button is allowed per form!');
      return;
    }

    if ((blockType === 'checkbox' || blockType === 'radio') && (numButtons <= 0 || buttonNames.some(name => name.trim() === ''))) {
      alert('Please fill in all the fields for checkbox or radio buttons.');
      return;
    }

    if (blockType === 'dropdown' && options.length === 0) {
      alert('Please add at least one option for the dropdown.');
      return;
    }

    const newBlock = {
      name: blockName,
      type: blockType,
      isRequired: isRequired,
      numButtons: numButtons,
      buttonNames: buttonNames.slice(0, numButtons),
      options: options,
    };

    const updatedForm = { ...forms[activeFormIndex] };
    updatedForm.blocks.push(newBlock);

    const updatedForms = [...forms];
    updatedForms[activeFormIndex] = updatedForm;

    setBlockName('');
    setBlockType('text');
    setIsRequired(false);
    setNumButtons(0);
    setButtonNames(Array(numButtons).fill(''));
    setOptions([]);
    setNewOption('');

    setForms(updatedForms);
  };

  const moveBlock = (dragIndex, hoverIndex, formIndex) => {
    const newForms = [...forms];

    // Ensure formIndex is within bounds
    if (formIndex >= 0 && formIndex < newForms.length) {
      const [draggedBlock] = newForms[formIndex].blocks.splice(dragIndex, 1);

      if (draggedBlock) {
        // Ensure the type property exists on draggedBlock
        if (!draggedBlock.hasOwnProperty('type')) {
          console.error('Block is missing the "type" property:', draggedBlock);
          return;
        }

        // Ensure the blocks array exists on the form
        if (!newForms[formIndex].hasOwnProperty('blocks')) {
          console.error('Form is missing the "blocks" property:', newForms[formIndex]);
          return;
        }

        if (draggedBlock.type === 'formname') {
          newForms.unshift(draggedBlock);
        } else {
          newForms[formIndex].blocks.splice(hoverIndex, 0, draggedBlock);
        }

        setForms(newForms);
      }
    }
  };

  const addForm = () => {
    const newForm = { blocks: [] };

    setForms([...forms, newForm]);
    setActiveFormIndex(forms.length);
  };

  const deleteForm = (formIndex) => {
    const updatedForms = forms.filter((form, index) => index !== formIndex);
    setForms(updatedForms);
    setActiveFormIndex(Math.max(0, formIndex - 1));
  };

  const activateForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].isActive = true;
    setForms(updatedForms);
  };

  const deactivateForm = (formIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].isActive = false;
    setForms(updatedForms);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <style>
        {`
 /* Your CSS goes here */
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  max-width: 300px;
  width: 50%;
  margin-top: 300px; 
  align-items: center;
  justify-content: center;
}

h2 {
  text-align: center;
  color: #333;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th, td {
  padding: 12px;
  text-align: center;
}

table input[type="radio"] {
  border: none;
}

button {
  background-color: rgb(31, 6, 168);
  color: #fff;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1e2df6;
}

@media only screen and (max-width: 600px) {
  form {
    width: 90%;
  }
}


a {
  text-decoration: none; 
}

a button {
  background-color: #28a745; 
  color: #fff;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  display: inline-block; 
}

a button:hover {
  background-color: #218838; 
}


.draggable-block {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px;
  }
  .block-card {
    border: 2px dashed #ddd;
    padding: 20px;
    margin: 20px auto; /* Set margin to 'auto' for horizontal centering */
    width: 600px;

  }
  
  
  .formname-block {
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
  
  .formname-label {
    font-weight: bold;
    color: rgb(61, 177, 249);
    font-size:30px;
  }
  
  .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .button-wrapper button {
    margin: 0;
  }

  .option-row {
    display: flex;
    gap: 10px;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  
  .checkbox-row .option-item {
    margin-right: 20px; 
  }
 
/* To Make Responsive  */
@media only screen and (max-width: 1200px) {
  .block-card {
    width: 100%;
    max-width: 95%; 
    overflow-x: hidden;
  }
}

@media only screen and (max-width: 992px) {
  .block-card {
    width: 100%;
    max-width: 95%;
    overflow-x: hidden;
  }
}



@media only screen and (max-width: 768px) {
  .block-card {
    width: 100%;
    max-width: 95%;
    overflow-x: hidden;
  }
}



@media only screen and (max-width: 600px) {
  .block-card {
    width: 100%;
    max-width: 95%;
    overflow-x: hidden;
  }
}



@media only screen and (max-width: 490px) {
  .block-card {
    width: 100%;
    max-width: 95%;
    overflow-x: hidden;
  }
}



@media only screen and (max-width: 375px) {
  .block-card {
    width: 100%;
    max-width: 95%;
    overflow-x: hidden;
  }
}


/* Additional styles for mobile view SS-768 TO 375 */
@media only screen and (max-width: 768px) {
  .checkbox-row .option-item,
  .radio-row .option-item {
    margin-right: 10px;
    flex-basis: calc(33.33% - 10px); 
  }
}

@media only screen and (max-width: 600px) {
  .checkbox-row .option-item,
  .radio-row .option-item {
    margin-right: 10px;
    flex-basis: calc(50% - 10px); 
  }
}


@media only screen and (max-width: 375px) {
  .checkbox-row .option-item,
  .radio-row .option-item {
    margin-right: 10px;
    flex-basis: calc(100% - 10px);
  }
}


        `}
      </style>
      <div>
        <h1 style={{ color: 'rgb(61, 177, 249)', fontSize: '3em', textAlign: 'center' }}>Custom Survey</h1>
        <label>
          Name for the Field:
          <input type="text" value={blockName} onChange={(e) => setBlockName(e.target.value)} required />
        </label>

        <label>
          Input Type:
          <select value={blockType} onChange={(e) => setBlockType(e.target.value)}>
            <option value="formname">Formname</option>
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
            <option value="dropdown">Drop Down</option>
            <option value="radio">Radio Button</option>
            <option value="checkbox">Check Box</option>
            <option value="textarea">Text Area</option>
            <option value="button">Button</option>
            <option value="email">Email</option>
          </select>
        </label>

        {blockType === 'checkbox' || blockType === 'radio' ? (
          <div>
            <label>
              Number of Buttons:
              <input
                type="number"
                value={numButtons}
                onChange={(e) => setNumButtonsAndUpdateNames(parseInt(e.target.value))}
                required
              />
            </label>

            {[...Array(numButtons)].map((_, buttonIndex) => (
              <label key={buttonIndex}>
                Button {buttonIndex + 1} Name:
                <input
                  type="text"
                  value={buttonNames[buttonIndex]}
                  onChange={(e) => {
                    const newButtonNames = [...buttonNames];
                    newButtonNames[buttonIndex] = e.target.value;
                    setButtonNames(newButtonNames);
                  }}
                  required
                />
              </label>
            ))}
          </div>
        ) : blockType === 'dropdown' ? (
          <div>
            <label>
              Add Option Name:
              {options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <span>{option}</span>
                  <button
                    onClick={() => removeOption(optionIndex)}
                    style={{ marginRight: '30px', background: 'none' }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="New Option"
                />
                <button onClick={addOption}>Add Option</button>
              </div>
            </label>
          </div>
        ) : null}

        {blockType !== 'formname' && blockType !== 'button' && blockType !== 'checkbox' && blockType !== 'radio' && blockType !== 'dropdown' && (
          <label>
            Is Required:
            <select value={isRequired} onChange={(e) => setIsRequired(e.target.value === 'true')}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>
        )}

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={addBlock}
            style={{
              display: 'inline-block',
              margin: '0 10px', // Adjust the horizontal margin as needed
              marginTop: '20px',
            }}
          >
            Add Block
          </button>

          <button
            onClick={addForm}
            style={{
              display: 'inline-block',
              margin: '0 10px', // Adjust the horizontal margin as needed
              marginTop: '20px',
            }}
          >
            Add Form
          </button>
        </div>


        {forms.map((form, formIndex) => (
          <div key={formIndex}>
            <br></br>
            <br></br>
            <button onClick={() => deleteForm(formIndex)} style={{ marginBottom: '10px' }}>Delete Form</button>
            <h2 style={{ color: 'Black', fontSize: '2em', textAlign: 'center' }}>Form {formIndex + 1}</h2>
            <div className="block-card">
              {form?.blocks?.map((block, index) => (
                <DraggableBlock
                  key={index}
                  formIndex={formIndex}
                  id={index}
                  index={index}
                  name={block.name}
                  type={block.type}
                  isRequired={block.isRequired}
                  moveBlock={moveBlock}
                  numButtons={block.numButtons}
                  buttonNames={block.buttonNames}
                  options={block.options}
                />
              ))}
            </div>
            {/*  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                onClick={() => activateForm(formIndex)}
                style={{ backgroundColor: form.isActive ? 'green' : '', color: 'white', padding: '8px', borderRadius: '4px' }}
              >
                Activate
              </button>
              <button
                onClick={() => deactivateForm(formIndex)}
                style={{ backgroundColor: !form.isActive ? 'red' : '', color: 'white', padding: '8px', borderRadius: '4px', marginLeft: '10px' }}
              >
                Deactivate
              </button>
            </div>
            */}
          </div>
        ))}
      </div>

    </DndProvider>
  );
};

export default AddForm;
