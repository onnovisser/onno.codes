import { css } from '@emotion/core';
import React from 'react';

const className = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

function BasicVideo({ youtube, vimeo, url }) {
  return (
    <div
      css={css`
        height: 0;
        position: relative;
        padding-bottom: 56.25%; /* 16:9 */
      `}
    >
      {youtube && (
        <iframe
          src={`https://www.youtube.com/embed/${youtube}`}
          frameBorder="0"
          allowFullScreen
          title="video-embed"
          css={className}
        />
      )}
      {vimeo && (
        <iframe
          src={`https://player.vimeo.com/video/${vimeo}`}
          frameBorder="0"
          allow="fullscreen"
          allowFullScreen
          title="video-embed"
          css={className}
        />
      )}
      {url && <video css={className} src={url} controls playsInline />}
    </div>
  );
}

export default BasicVideo;
