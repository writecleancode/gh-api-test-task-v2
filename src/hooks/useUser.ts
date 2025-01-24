import { octokit, requestHeaders } from '@/uilts/githubApiData';

export const formatDate = (givenDate: string) => new Date(givenDate).toLocaleDateString('PL-pl');

const getRepositories = async (reposUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: reposUrl,
			sort: 'updated',
			headers: requestHeaders,
		});

		const repositoriesArr = response.data;
		return repositoriesArr;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUser = async (userId: number) => {
	try {
		const response = await octokit.request('GET /user/{account_id}', {
			account_id: userId,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});

		const repositories = await getRepositories(response.data.repos_url);

		const user = response.data;
		formatDate(user.created_at);
		return {
			...user,
			repositoriesData: repositories,
		};
	} catch (error) {
		console.log(error);
		return {};
	}
};
