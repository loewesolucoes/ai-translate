"use client";

import "./page.scss";

import { Layout } from "../shared/layout";
import ArrowIcon from './arrow.svg'
import { useEffect, useState } from "react";
import Link from "next/link";

// TODO: trocar pra um arquivo markdown
const qea = [
  {
    question: "Vocês possuem Termos de uso e Política de Privacidade?",
    answer: <span className="d-flex flex-column"><span>Sim! Eles podem ser encontrado aqui:</span> <ul> <li><Link href="/termos-de-uso">Termos de uso</Link></li>&nbsp; <li><Link href="/politica-de-privacidade">Política de Privacidade</Link> </li> </ul></span>,
  },
]

function FAQ() {
  const [opened, setOpened] = useState<any>({});

  useEffect(() => {
    document.title = `Perguntas frequentes | ${process.env.NEXT_PUBLIC_TITLE}`
  }, []);

  return (
    <main className="faq container mt-3">
      <section className="py-12 py-sm-24 bg-info-light ">
        <div className="container">
          <div className="mb-5 text-center">
            <span className="fs-5 fw-semibold text-primary text-uppercase">POSSUI ALGUMA DÚVIDA?</span>
            <h1 className="mt-3 mb-0">Perguntas frequentes</h1>
          </div>
          <ul className="questions mb-3">
            {qea.map(x => (
              <li key={x.question} className={`question ${opened[x.question] && 'show'}`}>
                <button className="btn p-4 mb-2 w-100 bg-white fw-medium text-start lh-base rounded-4 border border-primary" onClick={e => setOpened({ ...opened, [x.question]: !opened[x.question] })}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="fs-7 mb-0 text-success">{x.question}</h6>
                    </div>
                    <div className="ps-4">
                      <ArrowIcon className="arrow" />
                    </div>
                  </div>
                  <span className="answer">{x.answer}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="d-flex flex-wrap align-items-center justify-content-center">
            <span className="me-1">Ainda com dúvidas?</span>
            <a className="btn px-0 btn-link fw-bold" href="https://loewesolucoes.github.io/">Entre em contato</a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <FAQ />
    </Layout>
  );
}

