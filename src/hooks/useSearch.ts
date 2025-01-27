import { octokit, requestHeaders } from '@/uilts/githubApiData';

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
		return [];
	}
};

const getContributors = async (contributorsUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: contributorsUrl,
			headers: requestHeaders,
		});

		const contributorsDataArr = response.data.map((item: Record<string, any>) => ({
			id: item.id,
			login: item.login,
			avatarUrl: item.avatar_url,
			profileUrl: item.html_url,
		}));

		return contributorsDataArr;
	} catch (error) {
		console.log(error);
		return [];
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

		return { results: repositoryData, resultsCategory: 'repositories', resultsTotal: Number(response.data.total_count) };
	} catch (error) {
		console.log(error);
		return { results: [], resultsCategory: 'repositories', resultsTotal: 0 };
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

		const usersData = response.data.items.map((resultItem: Record<string, any>) => ({
			id: resultItem.id,
			name: resultItem.login,
			profileUrl: resultItem.html_url,
			avatarUrl: resultItem.avatar_url,
		}));

		return { results: usersData, resultsCategory: 'users', resultsTotal: Number(response.data.total_count) };
	} catch (error) {
		console.log(error);
		return { results: [], resultsCategory: 'users', resultsTotal: 0 };
	}
};
