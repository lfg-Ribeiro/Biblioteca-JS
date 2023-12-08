class EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.codigo = codigo;
        this.emprestado = false;
        this.usuarioEmprestimo = null;
    }

    emprestar(usuario) {
        if (!this.emprestado) {
            this.emprestado = true;
            this.usuarioEmprestimo = usuario;
            console.log(${this.titulo} foi emprestado para ${usuario.nome}.);
        } else {
            console.log(${this.titulo} já está emprestado.);
        }
    }

    devolver() {
        if (this.emprestado) {
            this.emprestado = false;
            console.log(${this.titulo} foi devolvido.);
        } else {
            console.log(${this.titulo} não está emprestado.);
        }
    }
}

class Livro extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, genero) {
        super(titulo, autor, anoPublicacao, codigo);
        this.genero = genero;
    }

    informacoes() {
        console.log(Livro: ${this.titulo}\nAutor: ${this.autor}\nAno de Publicação: ${this.anoPublicacao}\nGenero: ${this.genero});
    }
}

class Revista extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, edicao) {
        super(titulo, autor, anoPublicacao, codigo);
        this.edicao = edicao;
    }

    informacoes() {
        console.log(Revista: ${this.titulo}\nAutor: ${this.autor}\nAno de Publicação: ${this.anoPublicacao}\nEdição: ${this.edicao});
    }
}

class Usuario {
    constructor(nome, registroAcademico, dataNascimento) {
        this.nome = nome;
        this.registroAcademico = registroAcademico;
        this.dataNascimento = dataNascimento;
    }
}

class Biblioteca {
    constructor() {
        this.acervo = [];
        this.usuarios = [];
    }

    adicionarItem(item) {
        this.acervo.push(item);
    }

    listarAcervo() {
        console.log("Acervo da Biblioteca:");
        this.acervo.forEach(item => console.log(item.titulo));
    }

    adicionarUsuario(usuario) {
        this.usuarios.push(usuario);
    }

    async carregarAcervoDaApi(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            const acervo = await response.json();

            acervo.forEach(item => {
                if (item.tipo === 'livro') {
                    this.adicionarItem(new Livro(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.genero));
                } else if (item.tipo === 'revista') {
                    this.adicionarItem(new Revista(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.edicao));
                }
            });

            console.log("Acervo carregado da API.");
        } catch (error) {
            console.error("Erro ao carregar o acervo da API:", error);
        }
    }

    realizarOperacoes() {
        // Adicionar usuarios a biblioteca
        const usuarios = [
            new Usuario("Inacio", "12345", "1990-01-15"),
            new Usuario("Jason", "67890", "1985-07-20"),
            new Usuario("Myers", "54321", "1998-03-10"),
            new Usuario("Chuck", "98765", "2000-12-05"),
            new Usuario("Freddy", "13579", "1993-09-28")
        ];

        usuarios.forEach(usuario => this.adicionarUsuario(usuario));

        // Instanciar Livros e Revista a partir da API
        this.carregarAcervoDaApi("https://api-biblioteca-mb6w.onrender.com/acervo");

        // Listar acervo
        this.listarAcervo();

        // Emprestimo e devolucao de itens
        this.emprestarItem("L001", "12345");  // Emprestimo valido
        this.emprestarItem("L001", "67890");  // Item já emprestado
        this.devolverItem("L001");  // Devolucao valida
        this.devolverItem("L001");  // Item nao esta emprestado

        // Listar acervo apos operacoes
        this.listarAcervo();
    }

    emprestarItem(codigo, registroAcademico) {
        const item = this.acervo.find(item => item.codigo === codigo);

        if (item && !item.emprestado) {
            const usuario = this.usuarios.find(usuario => usuario.registroAcademico === registroAcademico);

            if (usuario) {
                item.emprestar(usuario);
            } else {
                console.log("Usuario nao encontrado.");
            }
        } else {
            console.log("Item n encontrado ou ja emprestado.");
        }
    }

    devolverItem(codigo) {
        const item = this.acervo.find(item => item.codigo === codigo);

        if (item && item.emprestado) {
            item.devolver();
        } else {
            console.log("Item n encontrado ou n esta emprestado.");
        }
    }
}

// Instanciar a biblioteca e realizar operacoes
const biblioteca = new Biblioteca();
biblioteca.realizarOperacoes();