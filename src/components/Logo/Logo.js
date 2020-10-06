import React from 'react'
import css from './Logo.module.scss'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import logoImage from 'assets/images/logo.png'

const Logo = ({
  className,
  url,
  label = `carotta`
}) => {
  return url
    ? (
      <Link className={classnames(css.link, className)} to={url}>
        <p className={css.logo}>
          <img
            className={css.logoImg}
            src={logoImage}
            alt='Carrota logo'
          />
          { label }
        </p>
      </Link>
    )
    : (
      <p className={classnames(css.logo, className)}>
        <img
          className={css.logoImg}
          src={logoImage}
          alt='Carrota logo'
        />
        { label }
      </p>
    )
}

export default Logo
