import React, { useState } from 'react'
import css from './Customization.module.scss'
import { Collapse } from 'react-collapse/lib/Collapse'

const Customization = ({ children }) => {
  const [isCollapseOpened, toggleCollapseStatus] = useState(false)

  return (
    <>
      <button
        className={css.buttonCollapse}
        onClick={() => toggleCollapseStatus(state => !state)}
        type='button'
      >
        Customize transaction settings
      </button>
      <Collapse
        isOpened={isCollapseOpened}
        theme={{
          collapse: 'ReactCollapse--collapse',
          content: css.collapseContent
        }}
      >
        { children }
      </Collapse>

    </>
  )
}

export default Customization
