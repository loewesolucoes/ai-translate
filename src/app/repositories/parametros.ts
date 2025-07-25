import { DefaultFields, DefaultRepository, TableNames, DEFAULT_MAPPING } from "./default";

export interface Parametro extends DefaultFields {
  chave: string
  valor?: string
}

export const GOOGLE_DRIVE_REFRESH_TOKEN = 'GOOGLE_DRIVE_REFRESH_TOKEN';
export const GOOGLE_GENERATIVE_AI_API_KEY = 'GOOGLE_GENERATIVE_AI_API_KEY';

export class ParametrosRepository extends DefaultRepository {
  // @ts-ignore
  public readonly DEFAULT_MAPPING = { ...DEFAULT_MAPPING }
  private _paramsDict?: { [key: string]: Parametro };

  public async getDict(): Promise<{ [key: string]: Parametro }> {
    if (this._paramsDict == null) {
      this._paramsDict = await this.loadParamsOrDefault();
    }

    return this._paramsDict;
  }

  private async loadParamsOrDefault() {
    const params = (await this.list<Parametro>(TableNames.PARAMETROS)).reduce((p, n) => { p[n.chave] = n; return p; }, {});
    const nextParams = params;

    nextParams[GOOGLE_DRIVE_REFRESH_TOKEN] = params[GOOGLE_DRIVE_REFRESH_TOKEN] || { chave: GOOGLE_DRIVE_REFRESH_TOKEN, valor: '' };
    nextParams[GOOGLE_GENERATIVE_AI_API_KEY] = params[GOOGLE_GENERATIVE_AI_API_KEY] || { chave: GOOGLE_GENERATIVE_AI_API_KEY, valor: '' };

    const newParams = Object.keys(nextParams).map(x => nextParams[x]).filter(x => x.id == null);

    await Promise.all(newParams.map(x => this.save(TableNames.PARAMETROS, x)));

    return nextParams;
  }

  public async getByKey(chave: string): Promise<Parametro> {
    return (await this.getDict())[chave];
  }

  public async getValorByKey(chave: string): Promise<string | undefined> {
    return (await this.getDict())[chave]?.valor;
  }

  public async set(chave: string, valor?: string) {
    const paramsDict = await this.getDict();
    let param = paramsDict[chave];

    if (param == null)
      param = {} as any;

    const result = await this.save(TableNames.PARAMETROS, { ...param, chave, valor });

    delete this._paramsDict;

    return result;
  }
}