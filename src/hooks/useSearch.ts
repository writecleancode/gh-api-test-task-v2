import { Octokit } from '@octokit/core';
const API_TOKEN = import.meta.env.VITE_GH_TOKEN;

const octokit = new Octokit({ auth: API_TOKEN });
const requestHeaders = {
	'X-GitHub-Api-Version': '2022-11-28',
};

const getCommits = async (commitsUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: commitsUrl,
			headers: requestHeaders,
		});

		const commitsDataArr = response.data.map((item: Record<string, any>) => ({
			message: item.commit.message,
			date: item.commit.author.date,
			author: item.commit.author.name,
		}));

		return commitsDataArr;
	} catch (error) {
		console.log(error);
	}
};

const getContributors = async (contributorsUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: contributorsUrl,
			headers: requestHeaders,
		});

		const commitsDataArr = response.data.map((item: Record<string, any>) => ({
			login: item.login,
			avatarUrl: item.avatar_url,
			profileUrl: item.html_url,
		}));

		return commitsDataArr;
	} catch (error) {
		console.log(error);
	}
};

export const getMatchingRepositories = async (
	searchPhrase: string,
	sortValue: string,
	orderValue: string,
	resultsPerPageValue: number,
	currentPage: number
) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: `/search/repositories?q=${searchPhrase}`,
			sort: sortValue,
			order: orderValue,
			per_page: resultsPerPageValue,
			page: currentPage,
			headers: {
				...requestHeaders,
				accept: 'application/vnd.github+json',
			},
		});

		const repositoryData = await Promise.all(
			response.data.items.map(async (resultItem: Record<string, any>) => {
				const commits = resultItem.size > 0 ? await getCommits(resultItem.commits_url) : [];
				const contributors = resultItem.size > 0 ? await getContributors(resultItem.contributors_url) : [];

				return {
					id: resultItem.id,
					title: resultItem.full_name,
					url: resultItem.html_url,
					commits,
					contributors,
				};
			})
		);

		return { results: repositoryData, results_category: 'repositories', results_total: Number(response.data.total_count) };
	} catch (error) {
		console.log(error);
		return { error, results: [], results_category: 'repositories', results_total: 0 };
	}
};

export const getMatchingUsers = async (
	searchPhrase: string,
	sortValue: string,
	orderValue: string,
	resultsPerPageValue: number,
	currentPage: number
) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: `/search/users?q=${searchPhrase}`,
			sort: sortValue,
			order: orderValue,
			per_page: resultsPerPageValue,
			page: currentPage,
			headers: {
				...requestHeaders,
				accept: 'application/vnd.github+json',
			},
		});

		const results = response.data.items.map((resultItem: Record<string, any>) => ({
			id: resultItem.id,
			name: resultItem.login,
			profileUrl: resultItem.html_url,
			avatarUrl: resultItem.avatar_url,
		}));

		return { results, results_category: 'users', results_total: Number(response.data.total_count) };
	} catch (error) {
		console.log(error);
		return { error, results: [], results_category: 'users', results_total: 0 };
	}
};
