'use client'

import { useEffect, useState, useRef } from 'react';
import { PropostaI } from '@/utils/types/propostas';
import Image from 'next/image';  // Importação do componente Image

const formatDate = (data: string | null) => {
  if (!data) {
    return 'Data inválida';
  }

  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) {
    return 'Data inválida';
  }
  return `${dia}/${mes}/${ano}`;
};

const Propostas = () => {
  const [propostas, setPropostas] = useState<PropostaI[]>([]);
  const [clienteId] = useState<string>('1'); // Se o clienteId for fixo, pode ser uma constante
  const [preco, setPreco] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>('');
  const [produtoId, setProdutoId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ref para a área de propostas
  const propostasRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar as propostas da API
  const fetchPropostas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${clienteId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar propostas');
      }
      setPropostas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropostas();
  }, [clienteId]);

  // Função para submeter uma nova proposta
  const submitProposta = async () => {
    if (!produtoId || !preco || !descricao) {
      alert('Por favor, preencha todos os campos corretamente!');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId,  // Envia o clienteId
          produtoId,  // Envia o produtoId
          preco,      // Envia o preco
          descricao,  // Envia a descrição
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao enviar a proposta.');
      }

      alert('Proposta enviada com sucesso!');
      setPropostas((prevPropostas) => [data, ...prevPropostas]);

      if (propostasRef.current) {
        propostasRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProposta = async (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir esta proposta?');
    if (!confirm) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propostas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Proposta excluída com sucesso!');
        setPropostas((prevPropostas) => prevPropostas.filter((proposta) => proposta.id !== id));
      } else {
        throw new Error('Falha ao excluir a proposta.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-6">
      <h1 className="mb-8 text-3xl font-extrabold text-gray-100 dark:text-dark">Controle de Propostas</h1>

      <div className="bg-gray-500/20 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-100 dark:text-dark mb-4">Submeter Nova Proposta</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitProposta();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="produtoId" className="block text-lg font-medium text-white">ID do Produto</label>
            <input
              type="text"
              id="produtoId"
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o ID do produto"
              required
            />
          </div>

          <div>
            <label htmlFor="preco" className="block text-lg font-medium text-white">Preço</label>
            <input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))} // Aqui o valor é garantido como número
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o preço"
              required
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-lg font-medium text-white">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite uma descrição para a proposta"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 mt-4 bg-blue-600 text-dark font-semibold rounded-lg hover:bg-blue-700 transition duration-300 text-white ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Proposta'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h3 className="text-2xl font-semibold text-white dark:text-dark mb-4">Propostas Enviadas</h3>
      <div ref={propostasRef} className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white dark:text-dark">Produto</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white dark:text-dark">Foto</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white dark:text-dark">Descrição</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white dark:text-dark">Resposta</th>
              <th className="px-6 py-3 text-left text-xl font-semibold text-white dark:text-dark">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Carregando....</td>
              </tr>
            ) : (
              propostas.map((proposta) => (
                <tr key={proposta.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-6 py-3">{proposta.produtoId}</td>
                  <td className="px-6 py-3">
                    <Image
                      src={`https://via.placeholder.com/150?text=Imagem+${proposta.produtoId}`}
                      alt={`Imagem do produto ${proposta.produtoId}`}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </td>
                  <td className="px-6 py-3">{proposta.descricao}</td>
                  <td className="px-6 py-3">{formatDate(proposta.resposta)}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => deleteProposta(proposta.id)}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Propostas;
