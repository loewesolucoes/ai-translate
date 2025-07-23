"use client";

import "./page.scss";

import { Layout } from "../shared/layout";

function Offline() {
  return (
    <main className="offline container mt-3">
      <h1>Termos de uso</h1>

      <h2>1. Termos</h2>
      <p>Ao acessar ao site <a href={process.env.NEXT_PUBLIC_URL}>{process.env.NEXT_PUBLIC_TITLE}</a>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p>
      <h2>2. Uso de Licença</h2>
      <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site {process.env.NEXT_PUBLIC_TITLE} , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:&nbsp;</p>
      <ol>
        <li>modificar ou copiar os materiais;&nbsp;</li>
        <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);&nbsp;</li>
        <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site {process.env.NEXT_PUBLIC_TITLE};&nbsp;</li>
        <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou&nbsp;</li>
        <li>transferir os materiais para outra pessoa ou &apos;espelhe&apos; os materiais em qualquer outro servidor.</li>
      </ol>
      <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por {process.env.NEXT_PUBLIC_TITLE} a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.</p>
      <h2>3. Isenção de responsabilidade</h2>
      <ol>
        <li>Os materiais no site da {process.env.NEXT_PUBLIC_TITLE} são fornecidos &apos;como estão&apos;. {process.env.NEXT_PUBLIC_TITLE} não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</li>
        <li>Além disso, o {process.env.NEXT_PUBLIC_TITLE} não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</li>
      </ol>
      <h2>4. Limitações</h2>
      <p>Em nenhum caso o {process.env.NEXT_PUBLIC_TITLE} ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em {process.env.NEXT_PUBLIC_TITLE}, mesmo que {process.env.NEXT_PUBLIC_TITLE} ou um representante autorizado da {process.env.NEXT_PUBLIC_TITLE} tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.</p>
      <h2>5. Precisão dos materiais</h2>
      <p>Os materiais exibidos no site da {process.env.NEXT_PUBLIC_TITLE} podem incluir erros técnicos, tipográficos ou fotográficos. {process.env.NEXT_PUBLIC_TITLE} não garante que qualquer material em seu site seja preciso, completo ou atual. {process.env.NEXT_PUBLIC_TITLE} pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, {process.env.NEXT_PUBLIC_TITLE} não se compromete a atualizar os materiais.</p>
      <h2>6. Links</h2>
      <p>O {process.env.NEXT_PUBLIC_TITLE} não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por {process.env.NEXT_PUBLIC_TITLE} do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
      <p><br />
      </p>
      <h3>Modificações</h3>
      <p>O {process.env.NEXT_PUBLIC_TITLE} pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
      <h3>Lei aplicável</h3>
      <p>Estes termos e condições são regidos e interpretados de acordo com as leis do {process.env.NEXT_PUBLIC_TITLE} e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>
    </main>
  );
}

export default function Page() {
  return (
    <Layout>
      <Offline />
    </Layout>
  );
}

