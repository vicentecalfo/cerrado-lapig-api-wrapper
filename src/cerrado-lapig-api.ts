import { RxHR, RxHttpRequestResponse } from '@akanass/rx-http-request';
import { Observable } from 'rxjs';
import { Options, QuerySearch, Reports } from './cerrado-lapig-api.interface';
const csvToJson = require('csvtojson');

export class CerradoLapigApi {
	private basePath = 'https://cepf.lapig.iesa.ufg.br/service/map/downloadCSV';
	private reports: { [key: string]: Reports } = {
		'uso-solo-mapbiomas': {
			layer: 'uso_solo_mapbiomas',
			columns: [ 'area_ha', 'classe', 'year' ]
		},
		'uso-solo-terraclass': { layer: 'uso_solo_terraclass', columns: [ 'area_ha', 'classe' ] },
		'uso-solo-probio': { layer: 'uso_solo_probio', columns: [ 'area_ha', 'classe' ] },
		'uso-solo-ecorregioes': {
			layer: 'bi_ce_ecorregioes_2019_5000_diversas',
			columns: [ 'area_ha', 'sequencia', 'nome' ]
		},
		'agro-agricultura-agrosatelite': {
			layer: 'agricultura_agrosatelite',
			columns: [ 'area_ha', 'classe', 'year' ]
		},
		'agro-pastagem-regular-lapig': { layer: 'pasture', columns: [ 'area_ha', 'year' ] },
		'agro-pastagem-classes-degradacao-lapig': { layer: 'classes_degradacao_pastagem', columns: [ 'area_ha' ] },
		'agro-pecuaria-rebanho-bovino-ibge': { layer: 'lotacao_bovina_regions', columns: [ 'n_kbcs', 'ua', 'year' ] },
		'agro-pecuaria-prod-leite-ibge': {
			layer: 'bi_ce_leite_quantidade_municipio_250_ibge',
			columns: [ 'prod_leite', 'year' ]
		},
		'agro-agricultura-algodao-ibge': {
			layer: 'bi_ce_algodao_area_municipio_250_ibge',
			columns: [ 'area_ha', 'year' ]
		},
		'agro-agricultura-cana-ibge': {
			layer: 'bi_ce_cana_area_municipio_250_ibge',
			columns: [ 'area_ha', 'year' ]
		},
		'agro-agricultura-milho-ibge': {
			layer: 'bi_ce_milho_area_municipio_250_ibge',
			columns: [ 'area_ha', 'year' ]
		},
		'agro-agricultura-soja-ibge': {
			layer: 'bi_ce_soja_area_municipio_250_ibge',
			columns: [ 'area_ha', 'year' ]
		},
		'agro-agricultura-carvao-vegetal-ibge': {
			layer: 'bi_ce_carvao_vegetal_quantidade_municipio_250_ibge',
			columns: [ 'qto_produz', 'year' ]
		},
		'agro-agricultura-lenha-ibge': {
			layer: 'bi_ce_lenha_quantidade_municipio_250_ibge',
			columns: [ 'qto_produz', 'year' ]
		},
		'agro-agricultura-madeira-ibge': {
			layer: 'bi_ce_madeira_quantidade_municipio_250_ibge',
			columns: [ 'qto_produz', 'year' ]
		},
		'areas-assentamentos': {
			layer: 'assesntamentos',
			columns: []
		},
		'areas-terras-indigenas': {
			layer: 'limites_terras_indigenas',
			columns: []
		},
		'areas-planejamento-hidrico': {
			layer: 'unidades_planejamento_hidrico',
			columns: []
		},
		'bio-fauna-sibbr': {
			layer: 'bi_ce_fauna_na_na_sibbr',
			columns: [ 'scientific', 'reino', 'filo', 'classe', 'ordem', 'familia', 'genero', 'especies', 'year' ]
		},
		'bio-flora-sibbr': {
			layer: 'bi_ce_flora_na_na_sibbr',
			columns: [ 'n_cientifi', 'reino', 'filo', 'classe', 'ordem', 'familia', 'genero', 'especie', 'year' ]
		},
		'bio-reserva-bioesfera': {
			layer: 'bi_ce_reserva_biosfera_2018_1000_greentec',
			columns: [
				'area_ha',
				'area_km2',
				'nome_uc',
				'categoria',
				'ano_cria',
				'grupo',
				'ato_legal',
				'status',
				'esfera',
				'classe'
			]
		},
		'bio-pato-mergulhao': {
			layer: 'or_vp_pato_mergulhao_2019_na_iat',
			columns: [
				'ano',
				'mês',
				'rio',
				'local',
				'adultos',
				'filhotes',
				'ppch',
				'agro',
				'boi',
				'desmata',
				'dtur',
				'fogo',
				'altitude',
				'risco1',
				'risco2',
				'risco3',
				'risco4',
				'impactos_o'
			]
		},
		'bio-areas-chave-kbas': {
			layer: 'areas_chave_biodiversidade',
			columns: [
				'otto',
				'cod, p_p_ra',
				'p_pe_ra',
				'fa_vu',
				'fa_en',
				'fa_cr',
				'fa_i_vu',
				'fa_i_en',
				'fa_i_cr',
				'flo_vu',
				'flo_en',
				'flo_cr',
				'irre_tt',
				'flo_i_vu',
				'flo_i_en',
				'flo_i_cr',
				'pc_p_ra',
				'pc_pe_ra',
				'pc_fa_vu',
				'pc_fa_cr',
				'pc_fa_en',
				'g_fa_mma',
				'pc_g_fa_mm',
				'pc_i_fa_vu',
				'pc_i_fa_cr',
				'pc_i_fa_en',
				'g_fa_iucn',
				'pc_g_fa_iu',
				'g_fa_mm_iu',
				'pc_g_mm_iu',
				'pc_fl_vu',
				'pc_fl_en',
				'pc_fl_cr',
				'g_fl_cnc',
				'pc_g_fl_cn',
				'pc_i_fl_vu',
				'pc_i_fl_en',
				'pc_i_fl_cr',
				'g_fl_iucn',
				'pc_g_fl_iu',
				'g_fl_cn_iu',
				'pc_g_cn_iu',
				'pc_irre',
				'biologico',
				'p_biologic',
				'fid_1',
				'otto_1',
				'cod_1',
				'shape_le_2',
				'shape_ar_1',
				'a_kba_ha',
				'reman',
				'ipa',
				'csc',
				'agua',
				'pc_reman',
				'pc_ipa',
				'pc_csc',
				'pc_agua',
				'g_pro_pri',
				'pc_pro_pri',
				'paisagem',
				'p_paisagem',
				'g_bio_pais',
				'fim_bio_pa',
				'class',
				'area',
				'shape_leng',
				'kba',
				'uf',
				'nome',
				'codigo',
				'shape_le_1',
				'shape_area'
			]
		},
		'bio-areas-conservacao-aves': {
			layer: 'bi_ce_iba_250_2009_savebrasil',
			columns: [ 'codigo', 'nome', 'area' ]
		},
		'bio-corredores-prioritarios-cepf': {
			layer: 'corredores_prioritarios_cepf',
			columns: [ 'nom_corred', 'priority' ]
		},
		'bio-uc-integral': {
			layer: 'unidades_protecao_integral',
			columns: [ 'nome', 'categoria', 'administra', 'ano_criaca', 'atolegal' ]
		},
		'area-desmatamento-prodes': {
			layer: 'desmatamento_prodes',
			columns: [ 'area_km2', 'view_date', 'year' ]
		},
		'area-desmatamento-siad': {
			layer: 'desmatamento_siad',
			columns: [ 'area_km2', 'year' ]
		},
		'area-desmatamento-glad': {
			layer: 'desmatamento_glad',
			columns: [ 'area_km2', 'year' ]
		},
		'alerta-desmatamento-deter': {
			layer: 'alertas_desmatamento_deter',
			columns: [ 'area_km2', 'view_date', 'created_da', 'year' ]
		},
		'area-queimada-lapig': {
			layer: 'queimadas_lapig',
			columns: [ 'area_km2', 'burndate', 'year' ]
		},
		'regioes-hidrograficas': {
			layer: 'regioes_hidrograficas',
			columns: [
				'rhi_sg',
				'rhi_cd',
				'rhi_nm',
				'rhi_ar_km2',
				'rhi_ar_ha',
				'rhi_gm_are',
				'rhi_gm_per',
				'rhi_ve',
				'rhi_cheia2',
				'rhi_seca20'
			]
		},
		'conflito-por-terra-area': {
			layer: 'bi_ce_area_conflito_250_cpt',
			columns: [ 'area_ha', 'year' ]
		},
		'conflito-por-agua-ocorrencia': {
			layer: 'bi_ce_conflito_agua_250_cpt',
			columns: [ 'conflitos', 'year' ]
		},
		'conflito-por-agua-pessoas': {
			layer: 'bi_ce_conflito_agua_pessoas_250_cpt',
			columns: [ 'pessoas', 'year' ]
		},
		'conflito-por-terra-ocorrencia': {
			layer: 'bi_ce_conflito_terra_250_cpt',
			columns: [ 'conflitos', 'year' ]
		},
		'conflito-por-terra-pessoas': {
			layer: 'bi_ce_conflito_terra_pessoas_250_cpt',
			columns: [ 'pessoas', 'year' ]
		},
		'trabalho-escravo': {
			layer: 'bi_ce_trabalho_escravo_250_cpt',
			columns: [ 'pessoas', 'year' ]
		},
		'indice-desenvolvimento-humano': {
			layer: 'bi_ce_idhm_250_pnud',
			columns: [ 'idhm', 'year' ]
		},
		'pontos-validacao-coleta-campo-parada': {
			layer: 'pontos_campo_parada',
			columns: [
				'cobertura',
				'data',
				'periodo',
				'horario',
				'latitude',
				'longitude',
				'altura',
				'homoge',
				'invasoras',
				'gado',
				'qtd_cupins',
				'forrageira',
				'cultivo',
				'solo_exp',
				'obs',
				'condicao'
			]
		},
		'pontos-validacao-coleta-campo-sem-parada': {
			layer: 'pontos_campo_sem_parada',
			columns: [
				'cobertura',
				'data',
				'periodo',
				'horario',
				'latitude',
				'longitude',
				'altura',
				'homoge',
				'invasoras',
				'gado',
				'qtd_cupins',
				'forrageira',
				'cultivo',
				'solo_exp',
				'obs',
				'condicao'
			]
		},
		'pontos-validacao-insp-visual-treinamento': {
			layer: 'pontos_tvi_treinamento',
			columns: [
				'index',
				'lon',
				'lat',
				'cons_1985',
				'cons_1986',
				'cons_1987',
				'cons_1988',
				'cons_1989',
				'cons_1990',
				'cons_1991',
				'cons_1992',
				'cons_1993',
				'cons_1994',
				'cons_1995',
				'cons_1996',
				'cons_1997',
				'cons_1998',
				'cons_1999',
				'cons_2000',
				'cons_2001',
				'cons_2002',
				'cons_2003',
				'cons_2004',
				'cons_2005',
				'cons_2006',
				'cons_2007',
				'cons_2008',
				'cons_2009',
				'cons_2010',
				'cons_2011',
				'cons_2012',
				'cons_2013',
				'cons_2014',
				'cons_2015',
				'cons_2016',
				'cons_2017',
				'pointedite'
			]
		},
		'pontos-validacao-insp-visual-validacao': {
			layer: 'pontos_tvi_treinamento',
			columns: [
				'index',
				'lon',
				'lat',
				'cons_1985',
				'cons_1986',
				'cons_1987',
				'cons_1988',
				'cons_1989',
				'cons_1990',
				'cons_1991',
				'cons_1992',
				'cons_1993',
				'cons_1994',
				'cons_1995',
				'cons_1996',
				'cons_1997',
				'cons_1998',
				'cons_1999',
				'cons_2000',
				'cons_2001',
				'cons_2002',
				'cons_2003',
				'cons_2004',
				'cons_2005',
				'cons_2006',
				'cons_2007',
				'cons_2008',
				'cons_2009',
				'cons_2010',
				'cons_2011',
				'cons_2012',
				'cons_2013',
				'cons_2014',
				'cons_2015',
				'cons_2016',
				'cons_2017',
				'pointedite'
			]
		}
	};
	constructor() {}

	get relatorioDisponiveis(): string[] {
		return Object.keys(this.reports);
	}

	buscarDados(opts: Options): Observable<RxHttpRequestResponse<any>> {
		const report = opts.relatorio.trim();
		let qs: QuerySearch = { layer: this.reports[report].layer };
		qs = this.appendRegionName(opts, qs);
		qs = this.appendColumns(opts, qs);
		console.log(qs);
		return RxHR.get(this.basePath, { qs });
	}

	private appendColumns(opts: Options, qs: QuerySearch) {
		const report = opts.relatorio.trim();
		const columnsCSV = this.reports[report].columns;
		if (opts.hasOwnProperty('ano')) qs.year = opts.ano;
		qs.columnsCSV = columnsCSV.join(', ');
		return qs;
	}

	private appendRegionName(opts: Options, qs: QuerySearch) {
		const hasMunicipality = opts.hasOwnProperty('codigoMunicipio');
		qs.filterRegion = hasMunicipality ? `cd_geocmu='${opts.codigoMunicipio}'` : "bioma='CERRADO'";
		qs.regionName = hasMunicipality ? opts.codigoMunicipio as string : 'CERRADO';
		return qs;
	}

	convertCsvToJson(csv: string): Observable<{ [key: string]: any }[]> {
		return new Observable((observer) => {
			csvToJson({
				output: 'json'
			})
				.fromString(csv)
				.then((json: Array<{ [key: string]: any }>) => {
					observer.next(this.correctTypes(json));
					observer.complete();
				});
		});
	}

	private correctTypes(json: Array<{ [key: string]: any }>): { [key: string]: any }[] {
		return json.map((row) => {
			const convertedRow: any = {};
			Object.keys(row).forEach((property) => {
				const isNumber = Number(row[property]).toString() !== 'NaN';
				convertedRow[property] = isNumber ? Number(row[property]) : row[property];
			});
			return convertedRow;
		});
	}
}

const cerrado = new CerradoLapigApi();

//   'uso-solo-mapbiomas',
//   'uso-solo-terraclass',
//   'uso-solo-probio',
//   'uso-solo-ecorregioes',
//   'agro-agricultura-agrosatelite',
//   'agro-pastagem-regular-lapig',
//   'agro-pastagem-classes-degradacao-lapig',
//   'agro-pecuaria-rebanho-bovino-ibge',
//   'agro-pecuaria-prod-leite-ibge',
//   'agro-agricultura-algodao-ibge',
//   'agro-agricultura-cana-ibge',
//   'agro-agricultura-milho-ibge',
//   'agro-agricultura-soja-ibge',
//   'agro-agricultura-carvao-vegetal-ibge',
//   'agro-agricultura-lenha-ibge',
//   'agro-agricultura-madeira-ibge',
//   'areas-assentamentos',
//   'areas-terras-indigenas',
//   'areas-planejamento-hidrico',
//   'bio-fauna-sibbr',
//   'bio-flora-sibbr',
//   'bio-reserva-bioesfera',
//   'bio-pato-mergulhao',
//   'bio-areas-chave-kbas',
//   'bio-areas-conservacao-aves',
//   'bio-corredores-prioritarios-cepf',
//   'bio-uc-integral',
//   'area-desmatamento-prodes',
//   'area-desmatamento-siad',
//   'area-desmatamento-glad',
//   'alerta-desmatamento-deter',
//   'area-queimada-lapig',
//   'regioes-hidrograficas',
//   'conflito-por-terra-area',
//   'conflito-por-agua-ocorrencia',
//   'conflito-por-agua-pessoas',
//   'conflito-por-terra-ocorrencia',
//   'conflito-por-terra-pessoas',
//   'trabalho-escravo',
//   'indice-desenvolvimento-humano',
//   'pontos-validacao-coleta-campo-parada',
//   'pontos-validacao-coleta-campo-sem-parada',
//   'pontos-validacao-insp-visual-treinamento',
//   'pontos-validacao-insp-visual-validacao'

cerrado
	.buscarDados({
		relatorio: 'uso-solo-mapbiomas',
		ano: 2019,
		codigoMunicipio: '3514502'
	})
	.toPromise()
	.then((result) => cerrado.convertCsvToJson(result.body).toPromise())
	.then((json) => console.log(json))
	.catch((error) => console.log(error));
