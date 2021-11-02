exports.transform = (data) => {
	return data.map((item) => {
		return {
			cotizacionId: item.cotizacionId,
			proyectoId: item.proyectoId,
			cliente: item.proyectos_ready.cliente,
			trabajo: item.proyectos_ready.trabajo,
			sitio: item.sitio,
			direccion: item.direccion,
			supervisor: item.supervisor,
			status: item.status,
			inicio: item.inicio,
			terminado: item.terminado,
			vistas: item.vistas ? item.vistas.length : 0,
		};
	});
};
