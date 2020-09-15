import React from 'react'
import css from './Footer.module.scss'
import { HOME_PAGE } from 'Pages/Routes'
import { Link } from 'react-router-dom'
import Social from 'components/Social/Social'
import { LangOptions } from 'utils/const'
import { setLang } from 'store/actions'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'components/Select/SelectStandard'
import { SelectStyleTypes } from 'components/Select/SelectStandard'

const Footer = () => {
  const footerLinks = [
    {
      label: 'How it works',
      url: HOME_PAGE
    },
    {
      label: 'Analytics',
      url: HOME_PAGE
    },
    {
      label: 'Contacts',
      url: HOME_PAGE
    },
    {
      label: 'Privacy Policy',
      url: HOME_PAGE
    },
  ]

  const dispatch = useDispatch()
  const lang = useSelector(state => state.ui.lang)

  const availableLangOptions = LangOptions
    .filter(langOption => langOption.value !== lang.value)

  const handleLangChange = evt => {
    dispatch(setLang(evt))
  }

  const navlist = (
    <ul className={css.list}>
      {footerLinks.map(({ label, url }, index) => (
        <li
          className={css.item}
          key={`Footer nav link#${index}`}
        >
          <Link className={css.link} to={url}>
            { label }
          </Link>
        </li>
      ))}
      {
        <li
          className={css.item}
        >
          <Select
            className={css.selectLang}
            options={availableLangOptions}
            value={lang}
            defaultValue={lang}
            onChange={handleLangChange}
            type={SelectStyleTypes.LANG}
          />
        </li>
      }
    </ul>
  )

  return (
    <footer className={css.footer}>
      <div className={css.navigation}>
        { navlist }
      </div>
      <Social />
      <p className={css.copyright}>
        © 2020 Carrota. All rights reserved
      </p>
    </footer>
  )
}

export default Footer
