import _ from 'lodash';
import { getKorte } from 'remote2/korte';

// const getKorte = () => 'OFF';

export const getAlma = () => {
  return `remote1: ${_.join(['al', 'ma'])} | ${getKorte()}`;
};
