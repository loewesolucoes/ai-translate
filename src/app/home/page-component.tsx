import { useState } from "react";
import { Input } from "../components/input";
import "./page.scss";
import { DateUtil } from "../utils/date";
import { useAuth } from "../contexts/auth";
import { Loader } from "../components/loader";
import { useAi } from "../contexts/ai";

export function Home() {
  const { userInfo } = useAuth();

  return (
    <div className="home-page container">
      <h1 className="mt-xl-3">👋 {DateUtil.generateGreetings()}{userInfo ? ', ' + userInfo?.user?.displayName : ''}</h1>
      <AiSection />
    </div>
  );
}

import howCanISay from "../prompts/how-can-i-say.md";
import isThisSenteceRight from "../prompts/is-this-sentence-right.md";
import translate from "../prompts/translate.md";
import { MarkdownUtils } from "../utils/markdown";

enum AiHelpType {
  IsThisSentenceRight = "isThisSentenceRight",
  HowCanISay = "howCanISay",
  Translate = "translate"
}

const SYSTEM_PROMPTS = {
  [AiHelpType.IsThisSentenceRight]: isThisSenteceRight,
  [AiHelpType.HowCanISay]: howCanISay,
  [AiHelpType.Translate]: translate
};

function AiSection() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("<em>Write some text to translate</em>");
  const [reasoning, setReasoning] = useState<string>("<em>Nothing to see</em>");
  const [activeHelpType, setIsHelpType] = useState<AiHelpType>(AiHelpType.IsThisSentenceRight);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showThinking, setShowThinking] = useState(false);
  const { fetchAiData } = useAi();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    setOutput("");
    setReasoning("");

    const systemPrompt = SYSTEM_PROMPTS[activeHelpType];

    const { answer, think } = await fetchAiData(systemPrompt, input, (x) => setOutput(MarkdownUtils.render(x)), (x) => setReasoning(MarkdownUtils.render(x)));

    setOutput(MarkdownUtils.render(answer));
    setReasoning(MarkdownUtils.render(think));
    setIsLoading(false);
  }

  function reset() {
    setInput("");
    setOutput("<em>Write some text to translate</em>");
    setReasoning("<em>Nothing to see</em>");
    setIsHelpType(AiHelpType.IsThisSentenceRight);
  }

  return (
    <article>
      <section className="card card-material-1">
        <form className="card-body" onSubmit={onSubmit}>
          <h3 className="card-title">Use ai to translate things</h3>
          <div className="mb-3 d-flex gap-3 flex-column flex-xl-row">
            <input type="radio" className="btn-check" name="ai-help-type" id="isThisSentenceRight" checked={activeHelpType === AiHelpType.IsThisSentenceRight} onChange={() => setIsHelpType(AiHelpType.IsThisSentenceRight)} />
            <label className="btn btn-outline-info" htmlFor="isThisSentenceRight">Is this sentence right?</label>
            <input type="radio" className="btn-check" name="ai-help-type" id="howCanISay" checked={activeHelpType === AiHelpType.HowCanISay} onChange={() => setIsHelpType(AiHelpType.HowCanISay)} />
            <label className="btn btn-outline-info" htmlFor="howCanISay">How can I say?</label>
            <input type="radio" className="btn-check" name="ai-help-type" id="translate" checked={activeHelpType === AiHelpType.Translate} onChange={() => setIsHelpType(AiHelpType.Translate)} />
            <label className="btn btn-outline-info" htmlFor="translate">Translate to pt-br</label>
          </div>
          <div className="mb-3">
            <label htmlFor="textToTranslate" className="form-label">Text to translate</label>
            <Input type="textarea" value={input} onChange={setInput} id="textToTranslate" />
          </div>
          <div className="d-flex gap-3 justify-content-end flex-column flex-xl-row">
            <button type="button" className="btn btn-secondary" onClick={reset}>Clear</button>
            <button type="submit" className="btn btn-primary">Translate</button>
          </div>
        </form>
      </section>
      <section className="card card-material-1 mt-3">
        <div className="card-body">
          <h3 className="card-title">Result</h3>
          <div className="bg-light rounded flex flex-column w-100">
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2 w-100"
              onClick={() => setShowThinking((prev) => !prev)}
            >
              🧠
              <span>
                {isLoading ? "Thinking..." : ""}
                {isLoading ? <Loader className="spinner-border-sm" /> : null}
                {!isLoading && !showThinking ? "View reasoning" : ""}
                {!isLoading && showThinking ? " Hide reasoning" : ""}
              </span>
              <span className="ms-auto text-secondary">
                {showThinking ? "▲" : "▼"}
              </span>
            </button>
            {showThinking && (
              <samp className="p-2 d-flex" dangerouslySetInnerHTML={{ __html: reasoning || "<em>Loading...</em>" }} />
            )}
          </div>
          <p className="card-text" dangerouslySetInnerHTML={{ __html: output || "<em>Loading...</em>" }} />
        </div>
      </section>
    </article>
  )
}
