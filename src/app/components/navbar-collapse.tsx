"use client";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";
import { ThemeSelector } from './theme-selector';
import IconHouse from '@material-design-icons/svg/filled/home.svg';
import IconGear from '@material-design-icons/svg/filled/settings.svg';
import IconQuestion from '@material-design-icons/svg/filled/contact_support.svg';

const pages = [
  {
    name: 'Início',
    path: '/',
    icon: <IconHouse width="24" height="24" viewBox="0 0 24 24" />,
  },
  {
    name: 'Configurações',
    path: '/configuracoes',
    icon: <IconGear width="24" height="24" viewBox="0 0 24 24" />
  },
  {
    name: 'Perguntas frequentes',
    path: '/faq',
    icon: <IconQuestion width="24" height="24" viewBox="0 0 24 24" />,
  },
];

interface CustomProps {
  show?: boolean
  className?: string
}

export function SideBarMenu() {
  const pathname = usePathname();

  return (
    <div className="card side-bar-menu w-100">
      <div className='card-body'>
        <ul className="navbar-nav flex-grow-1">
          <li className="nav-item not-link fw-semibold">
            <span className="nav-link disabled">Menu</span>
          </li>
          {pages.map(x => (
            <li key={x.path} className={`nav-item px-2 ${pathname == x.path ? 'active' : ''}`}>
              <Link className={`nav-link d-flex align-items-center`} href={x.path}>
                <span className="nav-icon">
                  {x.icon}
                </span>
                <span className='px-1 flex-grow-1'>
                  {x.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function NavbarCollapse({ show, className }: CustomProps) {
  const pathname = usePathname();

  return <div className={`collapse navbar-collapse justify-content-between ${show && 'show'} ${className}`} id="navbarSupportedContent">
    <ul className="navbar-nav">
      {pages.map(x => (
        <li key={x.path} className="nav-item">
          <Link className={`nav-link ${pathname == x.path ? 'active' : ''}`} href={x.path}>{x.icon}{' '}{x.name}</Link>
        </li>
      ))}
      <ThemeSelector />
    </ul>
    <AuthButton />
  </div>;
}


