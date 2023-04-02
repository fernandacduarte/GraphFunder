import React from 'react'

const ActiveItemSymbol = () => {
  return (
    <svg 
      data-accordion-icon="" 
      className="w-6 h-6 rotate-180 shrink-0" 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg">
        <path 
          fillRule="evenodd" 
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
          clipRule="evenodd" />
    </svg>
  )
}

const InactiveItemSymbol = () => {
  return (
    <svg 
      data-accordion-icon 
      className="w-6 h-6 shrink-0" 
      fill="currentColor" 
      viewBox="0 0 20 20" 
      xmlns="http://www.w3.org/2000/svg">
        <path 
          fillRule="evenodd" 
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
          clipRule="evenodd" />
    </svg>
  )
}

const AccordionLayout = ({ title, body, index, activeIndices, setActiveIndices }) => {
  const handleSetIndex = (index) => {
    console.log('activeIndices', activeIndices)
    const newIndices = activeIndices.map((item, idx) => {idx === index ? !item : item})
    setActiveIndices(arr => 
      arr.map((item, idx) => (
        idx === index ? !item : item
      )) 
    )
    console.log('newIndices', newIndices)
  }

  return (
    <div>
      <h2 id="accordion-flush-heading-1" onClick={() => handleSetIndex(index)}>
        <button 
          type="button" 
          className="flex items-center justify-between w-full pb-2 pt-5 text-left border-b border-gray-300 bg-transparent text-gray-700 font-semibold leading-5" 
          data-accordion-target="#accordion-flush-body-1" 
          aria-expanded={activeIndices[index] ? "true" : "false"} 
          aria-controls="accordion-flush-body-1">
          <span>{title}</span>
          {activeIndices[index]
            ? <ActiveItemSymbol />
            : <InactiveItemSymbol />
          }
        </button>
      </h2>
      {(activeIndices[index]) && (
        <div id="accordion-flush-body-1" className="" aria-labelledby="accordion-flush-heading-1">
          <div className="py-5 border-b border-gray-300">
            <p className="mb-2 text-gray-700">
              {body}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccordionLayout;
