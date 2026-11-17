import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';

export default function config(phase:string):NextConfig {
  return {
    // Keep the live development server separate from production builds.
    distDir: phase===PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    async redirects(){return [{source:'/story',destination:'/studio',permanent:true}]}
  };
}
