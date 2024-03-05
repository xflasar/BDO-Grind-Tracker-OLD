import React, { useState } from 'react'
import PropTypes from 'prop-types'
import '../../../../../assets/components/ui/History/DropDown.scss'

const DropDownTableElements = ({ dispatch }) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedElement, setSelectedElement] = useState('15')

  const handleElementClick = (element) => {
    setSelectedElement(element)
    setShowDropDown(false)
    dispatch({ type: 'ADD_ELEMENT', payload: element })
  }

  const handleShowDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  return (
    <div className='dropMenu-container' onClick={() => handleShowDropDown()}>
      <span>Show</span>
      <div className='dropMenu-container-value'>
        <span>{selectedElement}</span>
        <div className='dropMenu-container-items-container' style={{ display: showDropDown ? 'block' : 'none' }}>
          <div onClick={() => handleElementClick(15)}>
            15
          </div>
          <div onClick={() => handleElementClick(25)}>
            25
          </div>
        </div>
      </div>
      <span>entries</span>
    </div>
  )
}

DropDownTableElements.propTypes = {
  dispatch: PropTypes.func
}

export default DropDownTableElements
