import { Octokit } from '@octokit/core';

export const API_TOKEN = import.meta.env.VITE_GH_TOKEN;
export const octokit = new Octokit({ auth: API_TOKEN });
export const requestHeaders = {
	'X-GitHub-Api-Version': '2022-11-28',
};
