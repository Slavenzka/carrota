import React, { useRef } from 'react'
import css from './Home.module.scss'
import Container from 'components/Grid/Container'
import ContainerInner from 'components/Grid/ContainerInner'
import Logo from 'components/Logo/Logo'
import { DeviceTypes } from 'utils/const'
import { useDispatch, useSelector } from 'react-redux'
import { toggleModal } from 'store/actions'
import Heading from 'components/Heading/Heading'
import ExchangeIntroForm from 'components/ExchangeIntroForm/ExchangeIntroForm'
import Button, { ButtonTypes } from 'components/Button/Button'
import Summary from 'components/Summary/Summary'
import Footer from 'components/Footer/Footer'
import Modal from 'components/Modal/Modal'
import Navigation from 'components/Navigation/Navigation'

const Home = () => {
  const summaryRef = useRef(null)
  const deviceType = useSelector(state => state.elastic.deviceType)
  const userWallet = useSelector(state => state.data.userWallet)
  const dispatch = useDispatch()

  const createSummaryRef = node => summaryRef.current = node

  const handleBurgerClick = () => {
    dispatch(toggleModal(true, <Navigation />))
  }

  const handleClickScroll = () => {
    console.log(summaryRef.current)
    const target = summaryRef.current
    const scrollDistance = target.getBoundingClientRect().top + window.pageYOffset

    window.scrollTo({
      top: scrollDistance,
      behavior: 'smooth'
    })
  }

  return (
    <Container className={css.wrapper}>
      <section>
        <ContainerInner className={css.calculator}>
          <header className={css.header}>
            <Logo />
            {deviceType === DeviceTypes.ADAPTIVE &&
              <>
                <button
                  className={css.buttonScroll}
                  onClick={handleClickScroll}
                  type='button'
                >
                  Rates
                </button>
                <Button
                  label='Toggle adaptive menu visibility'
                  buttonStyle={ButtonTypes.BURGER}
                  onClick={handleBurgerClick}
                />
              </>
            }
          </header>
          <div className={css.content}>
            <Heading label='Smart Exchange' />
            {userWallet &&
              <p className={css.wallet}>
                { `You have connected wallet: ${userWallet}` }
              </p>
            }
            <ExchangeIntroForm deviceType={deviceType} className={css.form} />
          </div>
          <Modal />
        </ContainerInner>
      </section>
      <aside ref={createSummaryRef}>
        <ContainerInner className={css.navigation}>
          {deviceType === DeviceTypes.DESKTOP &&
            <header className={css.header}>
              <Navigation />
            </header>
          }
          <Summary deviceType={deviceType} />
          <Footer />
        </ContainerInner>
      </aside>
    </Container>
  )
}

export default Home
