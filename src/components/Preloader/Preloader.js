import React from 'react'
import css from './Preloader.module.scss'
import logo from 'assets/images/logo.png'
import classnames from 'classnames'

const Preloader = ({ className, isMini }) => {
  return isMini
    ? (
      <svg className={className} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 35' >
        <g><circle fillOpacity='1' cx='17.5' cy='17.5' r='17.5'/><animate attributeName='opacity' dur='2700ms' begin='0s' repeatCount='indefinite' keyTimes='0;0.167;0.5;0.668;1' values='0.3;1;1;0.3;0.3'/></g>
        <g><circle fillOpacity='1' cx='110.5' cy='17.5' r='17.5'/><animate attributeName='opacity' dur='2700ms' begin='0s' repeatCount='indefinite' keyTimes='0;0.334;0.5;0.835;1' values='0.3;0.3;1;1;0.3'/></g>
        <g><circle fillOpacity='1' cx='64' cy='17.5' r='17.5'/><animate attributeName='opacity' dur='2700ms' begin='0s' repeatCount='indefinite' keyTimes='0;0.167;0.334;0.668;0.835;1' values='0.3;0.3;1;1;0.3;0.3'/></g>
      </svg>
    )
    : (
      <p className={classnames(css.wrapper, className)}>
        <span className={css.label}>L</span>
        <img
          className={css.logo}
          src={logo}
          alt='Carrota logo'
        />
        <span className={css.label}>ading</span>
      </p>
    )
}

export default Preloader
