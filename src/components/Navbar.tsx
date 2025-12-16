import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '#', current: false },
  { name: 'Features', href: '#', current: false },
  { name: 'Blog', href: '#', current: false },
  { name: 'Support', href: '#', current: false },

]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center gap-20 sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <a className='font-medium text-xl text-white' href='#'>WorkCred Inc.</a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='text-white rounded-md px-3 py-2 text-sm font-medium hover:text-blue-500'>
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center gap-4'>
            <a className='text-white p-2 rounded-md px-3 py-3 text-sm font-medium hover:cursor-pointer hover:text-blue-500 flex'>
              Login
            </a>
            {/* <a className='text-white p-2 rounded-md px-3 py-3 text-sm font-medium hover:cursor-pointer hover:bg-white/5 flex'>
              Sign In
            </a> */}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}