from vectordb.shortcuts import autosync_model_to_vectordb

from dao.models import AttributeValue, Memory

autosync_model_to_vectordb(AttributeValue)
autosync_model_to_vectordb(Memory)
