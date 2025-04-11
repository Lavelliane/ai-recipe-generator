
import Link from 'next/link'

const OnboardingWelcome = () => {
  return (
    <div >
      <div className='flex justify-center items-center'>
        <h3 className='text-lg semi-bold text-center'>Welcome to your smart kitchen assistant. <br /> No stress, just good food—made for you.</h3>
      </div>
      <div className='flex justify-center items-center'>
        <Link href='/onboarding/progress' >
          <button className='bg-primary text-white px-4 py-2 rounded-md mt-10 hover:bg-orange-500'>Get Started</button>
        </Link>
      </div>
    </div>
  )
}

export default OnboardingWelcome
