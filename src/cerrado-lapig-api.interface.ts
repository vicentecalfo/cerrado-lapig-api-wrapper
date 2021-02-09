export interface Options {
	relatorio: string;
	ano?: number;
	codigoMunicipio?: string;
}

export interface QuerySearch {
	layer: string;
	filterRegion?: string;
	columnsCSV?: string;
	regionName?: string;
	year?: number;
}

export interface Reports {
	layer: string;
	columns: string[];
}
