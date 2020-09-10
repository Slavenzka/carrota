import React from 'react'
import css from './Logo.module.scss'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

const Logo = ({
  className,
  url,
  label = `carotta`
}) => {
  return url
    ? (
      <Link className={classnames(css.link, className)} to={url}>
        <p className={css.logo}>
          { label }
        </p>
      </Link>
    )
    : (
      <p className={classnames(css.logo, className)}>
        { label }
      </p>
    )
}

export default Logo
