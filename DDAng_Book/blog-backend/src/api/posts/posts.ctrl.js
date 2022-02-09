import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHTML from 'sanitize-HTML';

const { ObjectId } = mongoose.Types;
//console.log(ObjectId);

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  console.log(ctx.params);
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

/*
  POST /api/posts
  {
    title : "제목",
    body : "내용",
    tags : ["태그1","태그2", "태그3"]
  }
*/
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    //객체가 다음 필드 가지고 있음 검증
    title: Joi.string().required(), //required()가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), //문자열로 이루어진 배열
  });

  //검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  //const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; //Bad Request
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  //const { user } = ctx.state.user;
  const post = new Post({
    //포스트 인스턴스 만들기 위해 new 키워드 사용

    title,
    body: sanitizeHTML(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

//html 없애고 내용이 길면 200자 제한 함수
const removeHTMLAndShorten = (body) => {
  const filtered = sanitizeHTML(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};
/*
 GET /api/posts?username=&tag=&page=
*/

export const list = async (ctx) => {
  //query는 문자열이기 때문에 숫자로 변환해 줘야 함
  //값이 주어지지 않으면 1을 기본으로 사용
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  //tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  try {
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();

    const postCount = await Post.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts.map((post) => ({
      ...post,
      body: removeHTMLAndShorten(post.body),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/* 
  GET /api/posts/:id
*/

export const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

/*
  DELETE /api/posts/:id
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; //No Content (성공하긴 했지만 응답할 데이터 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  PATCH /api/posts/:id
  {
    title : "수정",
    body : "수정 내용",
    tags: ["수정", "태그"]
  }
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  //write에서 사용한 schema와 비슷한데 required()가 없음!!
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  //검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad Request
    ctx.body = result.error;
    return;
  }
  const nextDate = { ...ctx.request.body }; //객체 복사
  //body 주어지면 HTML 필터링
  if (nextDate.body) {
    nextDate.body = sanitizeHTML(nextDate.body);
  }

  try {
    const post = await Post.findByIdAndUpdate(id, nextDate, {
      new: true,
      //이 값을 설정하면 업데이트된 데이터를 반환함
      //false일 때는 업데이트되기 전의 데이터 반환함
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
GET /api/posts?username=&tag=&page=
*/

/*export const list a*/
